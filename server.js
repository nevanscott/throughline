const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const db = require('./db');

const server = http.createServer();

async function serveStaticFile(filename, response) {
  const file = path.join(__dirname, filename);
  try {
    const data = await fs.readFile(file);
    response.writeHead(200);
    response.end(data);
  } catch(error) {
    response.writeHead(404);
    response.end(JSON.stringify(error));
  }
}

async function handleRequest(request, response) {
  if (request.method === 'GET' && request.url === '/') {
    console.log(`Server: Received request for "${request.url}", responding with file "public/index.html"`);
    await serveStaticFile('public/index.html', response);
  } else if (request.method === 'GET' && request.url === '/main.css') {
    console.log(`Server: Received request for "${request.url}", responding with file "public/main.css"`);
    await serveStaticFile('public/main.css', response);
  } else if (request.method === 'GET' && request.url === '/main.js') {
    console.log(`Server: Received request for "${request.url}", responding with file "public/main.js"`);
    await serveStaticFile('public/main.js', response);
  } else if (request.method === 'GET' && request.url === '/api/messages') {
    const data = await db.getEntries();
    response.end(JSON.stringify(data));
  } else if (request.method === 'POST' && request.url === '/api/post') {
    let data = '';
    request.on('data', chunk => {
      data += chunk;
    })
    request.on('end', async () => {
      const entry = JSON.parse(data).message;
      await db.writeEntry(entry);
      response.end(JSON.stringify(entry));
    })
  } else {
    response.statusCode = 404;
    response.end();
  }
}

server.on('request', handleRequest);

server.listen(3000);
