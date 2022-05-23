const fs = require('fs');
const path = require('path');
const { readdir, copyFile, mkdir, stat } = require('fs/promises');

const srcFolder = path.join(__dirname, '\\files');
const dirFolder = path.join(__dirname, '\\files-copy');

fs.rm(dirFolder, { recursive: true }, () => {
  copyDir(srcFolder, dirFolder);
});

async function copyDir(src, dest) {
  const stats = await stat(src);
  const isDirectory = stats.isDirectory();
  if (isDirectory) {
    await mkdir(dest, { recursive: true });
    (await readdir(src)).forEach(function(childItemName) {
      copyDir(path.join(src, childItemName),
        path.join(dest, childItemName));
    });
  } else {
    await copyFile(src, dest);
  }
}