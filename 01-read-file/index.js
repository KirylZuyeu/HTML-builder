const fs = require('fs');
const path = require('path');

const pathForFile = path.join(__dirname, '/text.txt');

function read(filePath) {
    const readableStream = fs.createReadStream(filePath, 'utf8');
    readableStream.on('error', function (error) {
        console.log(`error: ${error.message}`);
    });
    readableStream.on('data', (chunk) => {
        console.log(chunk);
    });
}

read(pathForFile);