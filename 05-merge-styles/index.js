const fs = require('fs/promises')
const fss = require('fs')
const path = require('path')

bundleCSS(path.join(__dirname, 'styles'),path.join(__dirname,'project-dist', 'bundle.css'))

function bundleCSS(src, dest) {
  const outputCSS = fss.createWriteStream(dest);
  fs.readdir(src, { withFileTypes: true }).then(files => {
    for (let file of files) {
      if (path.extname(file.name) === '.css' && file.isFile()) {
        fss.createReadStream(path.join(src, file.name), 'utf-8').pipe(outputCSS)
        outputCSS.write('\n')
      }
    }
  })
}