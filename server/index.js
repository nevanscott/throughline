const http = require('http');

const router = require('./router');

const PORT = process.env.PORT || 3000;

const server = http.createServer();

server.on('request', router.handleRequest);

server.listen(PORT);

console.log(`Server: Running at http://localhost:${PORT}`);
