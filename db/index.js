const path = require('path');
const fs = require('fs').promises;

const file = path.join(__dirname, './messages');

async function getEntries() {
  try {
    const text = await fs.readFile(file);
    const entries = text.toString().trim().split('\n');
    return entries;
  } catch(error) {
    return [];
  }
}

async function writeEntry(entry) {
  try {
    const entries = await getEntries();
    entries.push(entry);
    const updated = entries.join('\n') + '\n';
    await fs.writeFile(file, updated);
  } catch(error) {
    console.error(error);
  }
}

module.exports = {
  writeEntry,
  getEntries
};
