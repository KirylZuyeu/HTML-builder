const fs = require('fs');
const path = require('path');

const pathForFile = path.join(__dirname, '/text.txt');


const content = 'Some content!';

fs.appendFile(pathForFile, content, err => {
  if (err) {
    console.error(err);
  }
});