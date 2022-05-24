const fs = require('fs');
const { join } = require('path');
const { readdir, copyFile, mkdir, stat } = require('fs/promises');

const srcFolder = join(__dirname, 'files');
const dirFolder = join(__dirname, 'files-copy');

fs.rm(dirFolder, { recursive: true }, () => {
  copyDir(srcFolder, dirFolder);
});

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