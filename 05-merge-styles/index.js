const { createReadStream, createWriteStream } = require('fs');
const { join, extname } = require('path');
const { readdir } = require('fs/promises');

const srcPath = join(__dirname, 'styles');
const bundlePath = join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles(src, bundle) {
  const files = await readdir(src, { withFileTypes: true });
  const cssFiles = files.filter((file) => extname(file.name) === '.css');
  const writable = createWriteStream(bundle, 'utf-8');
  cssFiles.forEach((file) => {
    const readable = createReadStream(join(src, file.name), 'utf-8');
    readable.on('data', (chunk) => writable.write(chunk));
  });
}

mergeStyles(srcPath, bundlePath);