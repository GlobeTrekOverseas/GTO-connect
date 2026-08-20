const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 4181);
const apiPort = Number(process.env.API_PORT || 5000);
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

http.createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');

  if (requestUrl.pathname.startsWith('/api/')) {
    const apiRequest = http.request({
      hostname: '127.0.0.1',
      port: apiPort,
      method: request.method,
      path: requestUrl.pathname + requestUrl.search,
      headers: request.headers,
    }, (apiResponse) => {
      response.writeHead(apiResponse.statusCode || 502, apiResponse.headers);
      apiResponse.pipe(response);
    });
    apiRequest.on('error', () => {
      response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify({ message: 'GlobeTrek API is unavailable. Please try again shortly.' }));
    });
    request.pipe(apiRequest);
    return;
  }

  const requestedPath = decodeURIComponent(requestUrl.pathname);
  const extension = path.extname(requestedPath);
  const relativePath = (!extension || requestedPath === '/') ? 'index.html' : requestedPath.replace(/^[/\\]+/, '');
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(path.resolve(root))) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    response.end(file);
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`GTO Connect preview running at http://127.0.0.1:${port}/`);
});
