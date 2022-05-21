const fs = require('fs');
const path = require('path');

const pathForFile = path.join(__dirname, '/secret-folder');

fs.readdir(pathForFile, 
  { withFileTypes: true },
  (err, files) => {
    console.log('\nCurrent directory files:');
    if (err)
      console.log(err);
    else {
      files.filter((dirent) => dirent.isFile()).forEach(file => {
        let extname = path.extname(file.name);
        let name = (file.name).replace (new RegExp (extname, 'g'), '');
        fs.stat(`${pathForFile}\\${file.name}`, (err, stats) => {
          if (err) {
            console.log('File doesn\'t exist.');
          } else {
            let size = Math.ceil(stats.size * 0.0009765625);
            console.log(`${name} - ${extname.slice(1)} - ${size}kb`);}
        });
      });
    }
  });
