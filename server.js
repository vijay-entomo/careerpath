const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
    // Normalize the URL
    let url = req.url.split('?')[0];

    // Handle root or index.html
    if (url === '/' || url === '/index.html') {
        url = '/index.html';
    }

    // Handle version subdirectories by redirecting to their index.html
    const versions = ['/v1', '/v2', '/v3', '/v4', '/v5', '/v6'];
    versions.forEach(v => {
        if (url === v || url === `${v}/`) {
            url = `${v}/index.html`;
        }
    });

    // Build the safe file path
    const safePath = url.replace(/\.\./g, '');
    const filePath = path.join(__dirname, safePath);

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log('404:', filePath);
            res.writeHead(404);
            res.end('File Not Found: ' + url);
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`\x1b[32m[SERVER RUNNING]\x1b[0m http://localhost:${PORT}`);
    console.log(`  └─ V1 - V6 Versions Registered.`);
});
