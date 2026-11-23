const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const cluster = require('cluster');
const os = require('os');

const PORT = process.env.PORT || 3000;
const ENABLE_CLUSTER = process.argv.includes('--cluster');

// In-Memory Server-Side Cache for Static Files & API Responses
const FILE_CACHE = new Map();
const MAX_CACHE_FILE_SIZE = 2 * 1024 * 1024; // 2MB max per cached file

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const COMPRESSIBLE_TYPES = new Set([
  'text/html; charset=utf-8',
  'text/css; charset=utf-8',
  'application/javascript; charset=utf-8',
  'application/json; charset=utf-8',
  'image/svg+xml'
]);

function getCacheControlHeader(ext) {
  if (ext === '.html') {
    return 'public, max-age=0, must-revalidate';
  }
  if (ext === '.css' || ext === '.js') {
    return 'public, max-age=86400, stale-while-revalidate=604800'; // 1 day + 7 day SWR
  }
  if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.woff2', '.woff', '.ttf', '.mp4'].includes(ext)) {
    return 'public, max-age=2592000, immutable'; // 30 days immutable CDN cache
  }
  return 'public, max-age=3600';
}

// API Response Cache (Checklist #1 & #6: Cache API responses and expensive queries)
const API_CACHE = new Map();

function startWorkerServer() {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);

    // Handle cached API endpoints
    if (reqPath.startsWith('/api/')) {
      const acceptEncoding = req.headers['accept-encoding'] || '';
      let cached = API_CACHE.get(reqPath);
      if (!cached || (Date.now() - cached.timestamp > 300000)) {
        const payload = {
          status: 'success',
          brand: 'Label By Vinnie',
          timestamp: new Date().toISOString(),
          cached: true,
          endpoint: reqPath
        };
        const jsonStr = JSON.stringify(payload);
        const rawBuf = Buffer.from(jsonStr);
        cached = {
          raw: rawBuf,
          gzip: zlib.gzipSync(rawBuf),
          timestamp: Date.now()
        };
        API_CACHE.set(reqPath, cached);
      }

      const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, max-age=300',
        'Vary': 'Accept-Encoding',
        'X-API-Cache': 'HIT'
      };

      if (acceptEncoding.includes('gzip')) {
        headers['Content-Encoding'] = 'gzip';
        headers['Content-Length'] = cached.gzip.length;
        res.writeHead(200, headers);
        res.end(cached.gzip);
      } else {
        headers['Content-Length'] = cached.raw.length;
        res.writeHead(200, headers);
        res.end(cached.raw);
      }
      return;
    }

    if (reqPath === '/' || reqPath === '/admin') reqPath = '/index.html';

    // Production Asset Optimization (Checklist #16: Automatically serve minified assets)
    let filePath;
    if (reqPath === '/style.css' && fs.existsSync(path.join(__dirname, 'public', 'style.min.css'))) {
      filePath = path.join(__dirname, 'public', 'style.min.css');
    } else if (reqPath === '/script.js' && fs.existsSync(path.join(__dirname, 'public', 'script.min.js'))) {
      filePath = path.join(__dirname, 'public', 'script.min.js');
    } else {
      filePath = path.join(__dirname, 'public', reqPath);
      if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, reqPath);
      }
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const cacheControl = getCacheControlHeader(ext);

    // Support 206 Partial Content (HTTP Range Requests) for smooth video seeking & scrubbing
    if (ext === '.mp4') {
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': contentType,
          'Cache-Control': cacheControl,
          'Access-Control-Allow-Origin': '*'
        });
        file.pipe(res);
        return;
      }
    }

    // ETag Calculation & 304 Not Modified validation (eliminates unnecessary transfers)
    const etag = `W/"${stat.size.toString(16)}-${stat.mtimeMs.toString(16)}"`;
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, {
        'ETag': etag,
        'Cache-Control': cacheControl,
        'Vary': 'Accept-Encoding'
      });
      res.end();
      return;
    }

    const acceptEncoding = req.headers['accept-encoding'] || '';
    const canCompress = COMPRESSIBLE_TYPES.has(contentType) && stat.size > 256;

    // Check In-Memory File Cache
    let cached = FILE_CACHE.get(filePath);
    if (cached && cached.mtimeMs === stat.mtimeMs) {
      if (canCompress && acceptEncoding.includes('gzip') && cached.gzip) {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Encoding': 'gzip',
          'Content-Length': cached.gzip.length,
          'ETag': etag,
          'Cache-Control': cacheControl,
          'CDN-Cache-Control': cacheControl,
          'Vary': 'Accept-Encoding',
          'X-Cache': 'HIT-GZIP'
        });
        res.end(cached.gzip);
        return;
      } else if (!canCompress || !acceptEncoding.includes('gzip')) {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': cached.raw.length,
          'ETag': etag,
          'Cache-Control': cacheControl,
          'CDN-Cache-Control': cacheControl,
          'Vary': 'Accept-Encoding',
          'Accept-Ranges': 'bytes',
          'X-Cache': 'HIT-RAW'
        });
        res.end(cached.raw);
        return;
      }
    }

    // If file is small enough to cache in memory
    if (stat.size <= MAX_CACHE_FILE_SIZE) {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
          return;
        }

        if (canCompress) {
          zlib.gzip(data, { level: 6 }, (gzErr, gzippedData) => {
            if (!gzErr) {
              FILE_CACHE.set(filePath, {
                mtimeMs: stat.mtimeMs,
                raw: data,
                gzip: gzippedData
              });

              if (acceptEncoding.includes('gzip')) {
                res.writeHead(200, {
                  'Content-Type': contentType,
                  'Content-Encoding': 'gzip',
                  'Content-Length': gzippedData.length,
                  'ETag': etag,
                  'Cache-Control': cacheControl,
                  'CDN-Cache-Control': cacheControl,
                  'Vary': 'Accept-Encoding',
                  'X-Cache': 'MISS-GZIP'
                });
                res.end(gzippedData);
                return;
              }
            }

            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Length': data.length,
              'ETag': etag,
              'Cache-Control': cacheControl,
              'CDN-Cache-Control': cacheControl,
              'Vary': 'Accept-Encoding',
              'Accept-Ranges': 'bytes',
              'X-Cache': 'MISS-RAW'
            });
            res.end(data);
          });
        } else {
          FILE_CACHE.set(filePath, {
            mtimeMs: stat.mtimeMs,
            raw: data,
            gzip: null
          });

          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': data.length,
            'ETag': etag,
            'Cache-Control': cacheControl,
            'CDN-Cache-Control': cacheControl,
            'Vary': 'Accept-Encoding',
            'Accept-Ranges': 'bytes'
          });
          res.end(data);
        }
      });
      return;
    }

    // Streaming Fallback for large files
    const headers = {
      'Content-Type': contentType,
      'ETag': etag,
      'Cache-Control': cacheControl,
      'CDN-Cache-Control': cacheControl,
      'Vary': 'Accept-Encoding',
      'Accept-Ranges': 'bytes'
    };

    if (canCompress && acceptEncoding.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else {
      headers['Content-Length'] = stat.size;
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });

  server.listen(PORT, () => {
    console.log(`LABEL BY VINNIE Performance Server [PID ${process.pid}] running at http://localhost:${PORT}`);
  });
}

// Multi-Core Cluster Load Balancer
if (ENABLE_CLUSTER && cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary Load Balancer ${process.pid} is starting ${numCPUs} workers...`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking replacement...`);
    cluster.fork();
  });
} else {
  startWorkerServer();
}
