const { createWriteStream } = require('fs');
const { join } = require('path');
const { createInterface } = require('readline');

const process = require('process');

const pathForFile = join(__dirname, 'text.txt');

console.log('Справка: Для прекращения нажмите комбинацию клавиш Ctrl+C или введите строку exit.');
console.log('Справка: Для сохранения текста в файл, нажмите Enter.');

function write(filePath) {
  const writableStream = createWriteStream(filePath, 'utf-8');

  writableStream.on('error',  (error) => {
    console.log(`\nAn error occured while writing to the file. Error: ${error.message}`);
  });

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Введите текст: '
  });

  rl.prompt();
    
  rl.on('line', (line) => {
    let sentence;
    switch (line.trim()) {
    case 'exit':
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