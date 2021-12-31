const path = require('path');
const fs = require('fs').promises;
const querystring = require('querystring');

const nunjucks = require('nunjucks');

const store = require('./store');

nunjucks.configure('client', { autoescape: true });

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
    console.log(`Router: Responding with file client/index.html`);
    const messages = await store.getEntries();
    const body = nunjucks.render('index.html', { messages });
    response.end(body);
  } else if (request.method === 'POST' && pathname === '/') {
    let data = '';
    request.on('data', chunk => {
      data += chunk;
    });
    request.on('end', async () => {
      console.log(data);
      const formdata = querystring.parse(data);
      const entry = formdata.message;
      console.log(`Router: Sending new message to Store`);
      await store.writeEntry(entry);
      console.log(`Router: Redirecting to /`);
      response.statusCode = 302;
      response.setHeader('Location', '/');
      response.end();
    });
  } else if (request.method === 'GET' && pathname === '/main.css') {
    console.log(`Router: Responding with file client/main.css`);
    await serveStaticFile('../client/main.css', response);
  } else if (request.method === 'GET' && pathname === '/main.js') {
    console.log(`Router: Responding with file client/main.js`);
    await serveStaticFile('../client/main.js', response);
  } else if (request.method === 'GET' && pathname === '/api/messages') {
    console.log(`Router: Responding with list of messages`);
    const data = await store.getEntries();
    response.end(JSON.stringify(data));
  } else if (request.method === 'POST' && pathname === '/api/post') {
    let data = '';
    request.on('data', chunk => {
      data += chunk;
    });
    request.on('end', async () => {
      const entry = JSON.parse(data);
      console.log(`Router: Sending new message to Store`);
      await store.writeEntry(entry);
      console.log(`Router: Responding with new message`);
      response.end(JSON.stringify(entry));
    });
  } else {
    response.statusCode = 404;
    response.end();
  }
}

module.exports = {
  handleRequest
};
