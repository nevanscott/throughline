const path = require('path');
const fs = require('fs').promises;

const file = path.join(__dirname, './messages');

async function writeEntry(entry) {
  const text = await fs.readFile(file).catch(error => console.error(error));
  const data = text ? text.toString().trim().split('\n') : [];
  data.push(entry);
  const updated = data.join('\n') + '\n';
  await fs.writeFile(file, updated).catch(error => console.error(error));
}

async function getEntries() {
  const text = await fs.readFile(file).catch(error => console.error(error));
  const data = text ? text.toString().trim().split('\n') : [];
  return data;
}

module.exports = {
  writeEntry,
  getEntries
};
