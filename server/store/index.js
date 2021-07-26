const path = require('path');
const fs = require('fs').promises;

const file = path.join(__dirname, 'messages');

const NEWLINE = '\n';

async function getEntries() {
  try {
    const handle = await fs.readFile(file);
    const entries = handle.toString().trim().split(NEWLINE);
    return entries;
  } catch(error) {
    return [];
  }
}

async function writeEntry(entry) {
  try {
    const entries = await getEntries();
    entries.push(entry);
    const updated = entries.join(NEWLINE) + NEWLINE;
    await fs.writeFile(file, updated);
  } catch(error) {
    console.error(error);
  }
}

module.exports = {
  writeEntry,
  getEntries
};
