const http = require('http');

const router = require('./router');

const server = http.createServer();

server.on('request', router.handleRequest);

server.listen(3000);
