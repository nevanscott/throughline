const sirv = require('sirv');
const polka = require('polka');

const assets = sirv('public');

polka()
  .use(assets)
  .use('/api', require('./api'))
  .listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on localhost:3000~!');
  });
