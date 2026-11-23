const fs = require('fs');
const path = require('path');

// Fast, reliable CSS Minifier
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Normalize newlines and whitespace
    .replace(/\s+/g, ' ')
    // Remove space around selectors, braces, colons, semicolons
    .replace(/\s*([\{\}:;,>+~])\s*/g, '$1')
    // Remove trailing semicolons before closing brace
    .replace(/;}/g, '}')
    .trim();
}

// Fast, reliable JS Minifier (safe token-aware stripper for comments and leading/trailing indentation)
function minifyJS(js) {
  // Preserve string literals while removing block and line comments
  const lines = js.split('\n');
  const cleanedLines = [];

  let inBlockComment = false;
  for (let line of lines) {
    let l = line.trim();
    if (!l) continue;

    if (inBlockComment) {
      if (l.includes('*/')) {
        l = l.substring(l.indexOf('*/') + 2).trim();
        inBlockComment = false;
      } else {
        continue;
      }
    }

    if (l.startsWith('/*')) {
      if (l.includes('*/')) {
        l = l.substring(l.indexOf('*/') + 2).trim();
      } else {
        inBlockComment = true;
        continue;
      }
    }

    if (l.startsWith('//')) {
      continue;
    }

    cleanedLines.push(l);
  }

  return cleanedLines.join('\n');
}

console.log('--- MINIFYING ASSETS (Checklist #16) ---');

// 1. Minify CSS
const rawCss = fs.readFileSync('public/style.css', 'utf8');
const minCss = minifyCSS(rawCss);
fs.writeFileSync('public/style.min.css', minCss);
console.log(`style.css: ${rawCss.length} bytes -> style.min.css: ${minCss.length} bytes (${Math.round((1 - minCss.length / rawCss.length) * 100)}% savings)`);

// 2. Minify JS
const rawJs = fs.readFileSync('public/script.js', 'utf8');
const minJs = minifyJS(rawJs);
fs.writeFileSync('public/script.min.js', minJs);
console.log(`script.js: ${rawJs.length} bytes -> script.min.js: ${minJs.length} bytes (${Math.round((1 - minJs.length / rawJs.length) * 100)}% savings)`);

console.log('--- MINIFICATION COMPLETE ---');
