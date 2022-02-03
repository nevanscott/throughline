const path = require('path');
const fs = require('fs').promises;

const file = path.join(__dirname, 'messages');

const NEWLINE = '\n';

async function getMessages() {
  console.log(`Store: Sending list of messages`);
  try {
    const handle = await fs.readFile(file);
    const entries = handle.toString().split(NEWLINE).slice(0,-1);
    return entries;
  } catch(error) {
    return [];
  }
}

async function writeMessage(message) {
  try {
    const messsages = await getMessages();
    messsages.push(message);
    const updated = messsages.join(NEWLINE) + NEWLINE;
    console.log(`Store: Writing new message to file`);
    await fs.writeFile(file, updated);
  } catch(error) {
    console.error(error);
  }
}

module.exports = {
  getMessages,
  writeMessage
};
