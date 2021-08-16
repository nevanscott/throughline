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
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);
  console.log(`Router: Received ${request.method} request for ${request.url}`);
  if (request.method === 'GET' && pathname === '/') {
    console.log(`Router: Responding with file client/index.html`);
    await serveStaticFile('../client/index.html', response);
  } else if (request.method === 'GET' && pathname === '/main.css') {
    console.log(`Router: Responding with file client/main.css`);
    await serveStaticFile('../client/main.css', response);
  } else if (request.method === 'GET' && pathname === '/main.js') {
    console.log(`Router: Responding with file client/main.js`);
    await serveStaticFile('../client/main.js', response);
  } else if (request.method === 'GET' && pathname === '/api/messages') {
    const data = await store.getEntries();
    console.log(`Router: Responding with list of messages`);
    response.end(JSON.stringify(data));
  } else if (request.method === 'POST' && pathname === '/api/post') {
    let data = '';
    request.on('data', chunk => {
      data += chunk;
    })
    request.on('end', async () => {
      const entry = JSON.parse(data);
      console.log(`Router: Sending new message to Store`);
      await store.writeEntry(entry);
      console.log(`Router: Responding with new message`);
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
