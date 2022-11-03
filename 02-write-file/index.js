const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

console.log('Этот скрипт создает файл с заданным вами текстом.  Введите пожалуйста текст');

stdin.on('data', (data) => {
  if (data.toString().slice(0, -2) === 'exit') process.exit();
  output.write(data);
})

process.on('SIGINT', () => {
  process.exit();
})

process.on('exit', () => {
  stdout.write('\nВвод закончен, итоговый файл text.txt находится в папке со скриптом.');
})