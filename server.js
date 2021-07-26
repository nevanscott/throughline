const http = require('http');
const server = http.createServer();
const path = require('path');
const fs = require('fs');
const db = require('./db');

function serveStaticFile(filename, response) {
  fs.readFile(path.join(__dirname, filename), function (error, data) {
    if (error) {
      response.writeHead(404);
      response.end(JSON.stringify(error));
      return;
    }
    response.writeHead(200);
    response.end(data);
  });
}

async function handleRequest(request, response) {
  if (request.method === 'GET' && request.url === '/') {
    console.log(`Server: Received request for "${request.url}", responding with file "public/index.html"`);
    serveStaticFile('public/index.html', response);
  } else if (request.method === 'GET' && request.url === '/main.css') {
    console.log(`Server: Received request for "${request.url}", responding with file "public/main.css"`);
    serveStaticFile('public/main.css', response);
  } else if (request.method === 'GET' && request.url === '/main.js') {
    console.log(`Server: Received request for "${request.url}", responding with file "public/main.js"`);
    serveStaticFile('public/main.js', response);
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
