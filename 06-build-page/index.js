const { createWriteStream, createReadStream } = require('fs');
const { join, extname, parse } = require('path');
const { readdir, mkdir, copyFile, stat } = require('fs/promises');
const fs = require('fs');

const bundlePath = join(__dirname, 'project-dist');
const mainAssetsPath = join(__dirname, 'assets');
const copyAssetsPath = join(bundlePath, 'assets');

const srcCssPath = join(__dirname, 'styles');

async function mergeStyles(src, bundle) {
  const files = await readdir(src, { withFileTypes: true });
  const cssFiles = files.filter((file) => extname(file.name) === '.css');
  const bundleCssPath = join(bundle, 'style.css');
  const writable = createWriteStream(bundleCssPath, 'utf-8');
  cssFiles.forEach((file) => {
    const readable = createReadStream(join(src, file.name), 'utf-8');
    readable.on('data', (chunk) => writable.write(chunk));
  });
}

async function copyDir(src, dest) {
  const stats = await stat(src);
  const isDirectory = stats.isDirectory();
  if (isDirectory) {
    await mkdir(dest, { recursive: true });
    (await readdir(src)).forEach(function(childItemName) {
      copyDir(join(src, childItemName),
        join(dest, childItemName));
    });
  } else {
    await copyFile(src, dest);
  }
}

async function replaceHtmlTemplates() {
  const link = join(__dirname, 'template.html');
  const readable = createReadStream(link, 'utf-8');
  const writable = createWriteStream(join(bundlePath, 'index.html'));
  let html = '';

  readable.on('data', async (chunk) => {
    html = chunk;
    const files = await readdir(join(__dirname, 'components'), {
      withFileTypes: true,
    });
    const htmlFiles = files.filter((file) => extname(file.name) === '.html');
    htmlFiles.forEach((file, i) => {
      if (file.isFile()) {
        const readableFile = createReadStream(
          join(__dirname, 'components', file.name)
        );
        const reg = `{{${parse(file.name).name}}}`;
        readableFile.on('data', (chunk) => {
          html = html.replace(reg, chunk);
          if (i === htmlFiles.length - 1) {
            writable.write(html);
          }
        });
      }
    });
  });
}

fs.rm(bundlePath, { recursive: true }, async () => {
  await mkdir(bundlePath, { recursive: true });
  await mergeStyles(srcCssPath, bundlePath);
  await copyDir(mainAssetsPath, copyAssetsPath);
  await replaceHtmlTemplates();
});