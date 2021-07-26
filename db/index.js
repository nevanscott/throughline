const path = require('path');
const fs = require('fs');

const file = path.join(__dirname, './messages');

async function writeEntry(entry) {
  const text = await fs.promises.readFile(file).catch(error => console.error(error));
  const data = text.toString().split('\n').slice(0, -1);
  data.push(entry);
  const updated = data.join('\n') + '\n';
  await fs.promises.writeFile(file, updated).catch(error => console.error(error));
}

async function getEntries() {
  const text = await fs.promises.readFile(file).catch(error => console.error(error));
  const data = text.toString().split('\n').slice(0, -1);
  return data;
}

module.exports = {
  writeEntry,
  getEntries
};
