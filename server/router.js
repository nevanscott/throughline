const path = require('path');
const fs = require('fs').promises;

const store = require('./store');

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
    console.log(`Server: Received request for "${request.url}", responding with file "client/index.html"`);
    await serveStaticFile('../client/index.html', response);
  } else if (request.method === 'GET' && request.url === '/main.css') {
    console.log(`Server: Received request for "${request.url}", responding with file "client/main.css"`);
    await serveStaticFile('../client/main.css', response);
  } else if (request.method === 'GET' && request.url === '/main.js') {
    console.log(`Server: Received request for "${request.url}", responding with file "client/main.js"`);
    await serveStaticFile('../client/main.js', response);
  } else if (request.method === 'GET' && request.url === '/api/messages') {
    const data = await store.getEntries();
    response.end(JSON.stringify(data));
  } else if (request.method === 'POST' && request.url === '/api/post') {
    let data = '';
    request.on('data', chunk => {
      data += chunk;
    })
    request.on('end', async () => {
      const entry = JSON.parse(data);
      await store.writeEntry(entry);
      response.end(JSON.stringify(entry));
    })
  } else {
    response.statusCode = 404;
    response.end();
  }
}

module.exports = {
  handleRequest
};
