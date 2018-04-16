const fs = require("fs");

module.exports = class IO {
  static readFile(filePath) {
    return fs.readFileSync(filePath, {
      encoding: 'utf8',
      flag: 'r'
    });
  }

  static writeFile(filePath, data, callback) {
    fs.writeFileSync(filePath, data);
  }
}
