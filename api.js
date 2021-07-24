const polka = require('polka');
const { json } = require('body-parser');
const db = require('./db');

module.exports = polka()
	.use(json())
	.get('/messages', async (req, res) => {
		const data = await db.getEntries();
		res.end(JSON.stringify(data));
	})
	.post('/post', async (req, res) => {
		await db.writeEntry(req.body);
		console.log('success');
		res.end(JSON.stringify(req.body));
	});
