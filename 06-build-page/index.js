const fs = require('fs/promises')
const fss = require('fs')
const path = require('path')

function copyDir(src, dest) {
  fs.mkdir(dest, {recursive:true}).then(() => {
    fs.readdir(src, { withFileTypes: true }).then(files => {
      for ( let file of files) {
        if(file.isFile())
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

async function bundleHTML(src, comp, dest) {
  const output = fss.createWriteStream(dest);
  let outputHTML = await fs.readFile(src, 'utf-8')
  await fs.readdir(comp, { withFileTypes: true }).then(async files => {
    for (let file of files)
      if (file.isFile() && path.extname(file.name) === '.html') {
        if (outputHTML.includes(`{{${file.name.slice(0, file.name.lastIndexOf('.'))}}}`)) {
          const textFile = await fs.readFile(path.join(comp, file.name), 'utf-8')
          outputHTML = outputHTML.replace(`{{${file.name.slice(0, file.name.lastIndexOf('.'))}}}`, textFile) 
        }
      }
  })
  output.write(outputHTML)
}

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }).then(it => {
  copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'))
  bundleCSS(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'style.css'))
  bundleHTML(path.join(__dirname, 'template.html'), path.join(__dirname, 'components') ,path.join(__dirname, 'project-dist', 'index.html'))
})

