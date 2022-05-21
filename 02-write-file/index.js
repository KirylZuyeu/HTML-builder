const fs = require('fs');
const path = require('path');
const readline = require('readline');

const process = require('process');

const pathForFile = path.join(__dirname, '/text.txt');

console.log('Справка: Для прекращения нажмите комбинацию клавиш Ctrl+C или введите строку exit.');
console.log('Справка: Для сохранения текста в файл, нажмите Enter.');

function read(filePath) {
  const readableStream = fs.createReadStream(filePath, 'utf8');
  readableStream.on('error', function (error) {
    console.log(`error: ${error.message}`);
  });
  readableStream.on('data', (chunk) => {
    console.log(chunk);
  });
}

function write(filePath) {
  const writableStream = fs.createWriteStream(filePath, { flags: 'a',
    encoding: null,
    // eslint-disable-next-line no-octal
    mode: 0666 
  });

  writableStream.on('error',  (error) => {
    console.log(`\nAn error occured while writing to the file. Error: ${error.message}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Введите текст: '
  });

  rl.prompt();
    
  rl.on('line', (line) => {
    let sentence;
    switch (line.trim()) {
    case 'exit':
    // case 'SIGINT':
      read(filePath);
      rl.close();
      break;
    default:
      sentence = line + '\n';
      writableStream.write(sentence);
      rl.prompt();
      break;
    }
  }).on('close', () => {
    writableStream.end();
    writableStream.on('finish', () => {
      console.log(`\nВсе внесенные строки были успешно сохранены в следующий файл ${filePath}`);
      process.exit(0);
    });
  });

}

write(pathForFile);

// .on('SIGINT', () => {
//   writableStream.end();
//   writableStream.on('finish', () => {
//     console.log(`\nAll your sentences have been written to ${filePath}`);
//     process.exit(0);
//   });
// })
