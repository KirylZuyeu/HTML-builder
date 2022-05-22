const fs = require('fs');
const path = require('path');
const { readdir, copyFile, mkdir, stat } = require('fs/promises');

const srcFolder = path.join(__dirname, '\\files');
const dirFolder = path.join(__dirname, '\\files-copy');

fs.rm(dirFolder, { recursive: true }, () => {
  copyDir(srcFolder, dirFolder).then();
});

async function copyDir(src, dest) {
  var stats = await stat(src);
  var isDirectory = stats.isDirectory();
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