const { createReadStream } = require('fs');
const { join } = require('path');

const pathForFile = join(__dirname, 'text.txt');

function read(filePath) {
  const readableStream = createReadStream(filePath, 'utf8');
  readableStream.on('error', function (error) {
    console.log(`error: ${error.message}`);
  });
  readableStream.on('data', (chunk) => {
    console.log(chunk);
  });
}

read(pathForFile);