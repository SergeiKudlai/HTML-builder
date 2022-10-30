const PATH = require('path');
const FS = require('fs');
const FILES = PATH.join(__dirname, 'content.txt');
const { stdin, stdout, exit } = process;
const OUTPUT = FS.createWriteStream(FILES);

stdout.write('Enter text:\n');

process.on('SIGINT', () => setExit());

stdin.on('data', data => {
  data.toString().trim() === 'exit' && setExit();
  OUTPUT.write(data);
})

function setExit() {
  stdout.write('God Bye');
  exit();
}