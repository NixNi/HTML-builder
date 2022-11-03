const fs = require('fs/promises')
const path = require('path')

function copyDir(src, dest) {
  fs.mkdir(dest, { recursive: true }).then(() => {
    fs.readdir(src, { withFileTypes: true }).then(files => {
      for (let file of files) {
        if (file.isFile())
          fs.copyFile(path.join(src, file.name), path.join(dest, file.name))
        else
          copyDir(path.join(src, file.name), path.join(dest, file.name))
      }
    }).then(() => {
      fs.readdir(dest, { withFileTypes: true }).then(files => {
        for (let file of files) {
          fs.access(path.join(src, file.name), fs.constants.R_OK).catch(() => {
            fs.rm(path.join(dest, file.name), { recursive: true, force: true })
          })
        }
      })
    })
  })
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'))
