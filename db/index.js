const jsonfile = require('jsonfile');
const path = require('path');

const file = path.join(__dirname, './data.json');

async function writeEntry(entry) {
  const data = await jsonfile.readFile(file).catch(error => console.error(error));
  data.messages.push(entry);
  await jsonfile.writeFile(file, data, { spaces: 2 }).catch(error => console.error(error));
  console.log('Write complete');
}

async function getEntries() {
  const entries = await jsonfile.readFile(file).catch(error => console.error(error));
  return entries;
}

module.exports = {
  writeEntry,
  getEntries
};
