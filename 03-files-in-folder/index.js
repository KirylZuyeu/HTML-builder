const fs = require('fs');
const { join, extname } = require('path');

const pathForFile = join(__dirname, 'secret-folder');

fs.readdir(pathForFile, 
  { withFileTypes: true },
  (err, files) => {
    console.log('\nCurrent directory files:');
    if (err)
      console.log(err);
    else {
      files.filter((dirent) => dirent.isFile()).forEach(file => {
        let extName = extname(file.name);
        let name = (file.name).replace(new RegExp (extName, 'g'), '');
        let filePath = join(pathForFile, file.name);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log('File doesn\'t exist.');
          } else {
            let size = stats.size * 0.0009765625;
            console.log(`${name} - ${extName.slice(1)} - ${size}kb`);}
        });
      });
    }
  });
