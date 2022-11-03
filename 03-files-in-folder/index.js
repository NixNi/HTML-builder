const fs = require('fs/promises')
const path = require('path')

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }).then(it => {
  for (file of it) {
    if (file.isFile()) {
      let str = file.name.slice(0, file.name.lastIndexOf('.')) + ' - ';
      str += file.name.slice(file.name.lastIndexOf('.') + 1) + ' - ';
      fs.stat(path.join(__dirname, 'secret-folder', file.name)).then(it => {
        console.log(str + it.size + ' bytes');
      })
    }  
  }
})