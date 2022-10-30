const FS = require('fs');
const PATH = require('path');
FS.createReadStream(PATH.join(__dirname, 'text.txt')).pipe(process.stdout);