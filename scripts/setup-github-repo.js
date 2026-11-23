const { execSync } = require('child_process');
const https = require('https');

function getGitHubCredentials() {
  try {
    const output = execSync('"C:\\Program Files\\Git\\mingw64\\bin\\git-credential-manager.exe" get', {
      input: 'protocol=https\nhost=github.com\n',
      encoding: 'utf8'
    });
    
    const lines = output.split('\n');
    let username = '';
    let password = '';
    for (const line of lines) {
      if (line.startsWith('username=')) username = line.split('=')[1].trim();
      if (line.startsWith('password=')) password = line.split('=')[1].trim();
    }
    return { username, password };
  } catch (err) {
    console.error('Failed to get credentials:', err.message);
    return null;
  }
}

async function createGitHubRepo(token, repoName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: repoName,
      description: 'LABEL BY VINNIE — Unlimited Fashion Choices. Luxury Indian ethnic wear, designer blouses, handcrafted Banarasi Chanderi and bespoke tailoring atelier.',
      private: false,
      has_issues: true,
      has_projects: true,
      has_wiki: true
    });

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: '/user/repos',
      method: 'POST',
      headers: {
        'User-Agent': 'NodeJS-GitHub-Client',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode === 201) {
            console.log(`Repository created successfully: ${json.html_url}`);
            resolve(json);
          } else if (res.statusCode === 422 && json.errors && json.errors.some(e => e.message && e.message.includes('already exists'))) {
            console.log(`Repository already exists on GitHub.`);
            resolve(json);
          } else {
            console.error(`GitHub API returned status ${res.statusCode}:`, body);
            resolve(json);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('1. Fetching GitHub credentials from Windows Credential Manager...');
  const creds = getGitHubCredentials();
  if (!creds || !creds.password) {
    console.error('No GitHub credentials found.');
    process.exit(1);
  }
  console.log(`Authenticated as GitHub user: ${creds.username}`);

  const repoName = 'Label-By-Vinnie';
  console.log(`2. Creating GitHub repository: ${repoName}...`);
  await createGitHubRepo(creds.password, repoName);

  console.log('3. Initializing local Git repository...');
  try {
    execSync('git init', { stdio: 'inherit' });
    execSync('git branch -M main', { stdio: 'inherit' });
    
    console.log('4. Staging files (respecting .gitignore)...');
    execSync('git add .', { stdio: 'inherit' });

    console.log('5. Creating initial commit...');
    execSync('git commit -m "Initial commit: Complete Label By Vinnie Luxury Boutique with 20-Point Performance Architecture"', { stdio: 'inherit' });

    console.log('6. Configuring remote origin...');
    const pushRemoteUrl = `https://${creds.username}:${creds.password}@github.com/${creds.username}/${repoName}.git`;
    const cleanRemoteUrl = `https://github.com/${creds.username}/${repoName}.git`;

    try {
      execSync(`git remote remove origin`, { stdio: 'ignore' });
    } catch (e) {}

    execSync(`git remote add origin ${pushRemoteUrl}`, { stdio: 'inherit' });

    console.log('7. Pushing complete code to GitHub main branch...');
    execSync('git push -u origin main --force', { stdio: 'inherit' });

    // Clean up inline token in remote url for security
    execSync(`git remote set-url origin ${cleanRemoteUrl}`, { stdio: 'inherit' });

    console.log('\n======================================================');
    console.log(`SUCCESS! Complete code moved to GitHub:`);
    console.log(`Repository URL: ${cleanRemoteUrl}`);
    console.log('======================================================\n');
  } catch (err) {
    console.error('Git execution error:', err.message);
    process.exit(1);
  }
}

main();
