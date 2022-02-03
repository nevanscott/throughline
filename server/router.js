const path = require('path');
const fs = require('fs').promises;
const querystring = require('querystring');

const store = require('./store');

const template = require('./template');

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
  console.log(`Router: Received ${request.method} request for ${request.url}`);
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);
  if (request.method === 'GET' && pathname === '/') {
    console.log(`Router: Responding with template loaded with messages`);
    const messages = await store.getMessages().then(messages => messages.reverse());
    const body = template({ messages });
    response.end(body);
  } else if (request.method === 'GET' && pathname === '/main.css') {
    console.log(`Router: Responding with file client/main.css`);
    await serveStaticFile('../client/main.css', response);
  } else if (request.method === 'POST' && pathname === '/message') {
    let data = '';
    request.on('data', chunk => {
      data += chunk;
    });
    request.on('end', async () => {
      const { message } = querystring.parse(data);
      if(message) {
        console.log(`Router: Sending new message to Store`);
        await store.writeMessage(message);
      }
      console.log(`Router: Redirecting to /`);
      response.writeHead(302, {
        'Location': '/'
      });
      response.end();
    });
  } else {
    response.writeHead(404);
    response.end();
  }
}

module.exports = {
  handleRequest
};
