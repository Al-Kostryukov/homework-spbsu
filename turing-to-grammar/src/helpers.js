const fs = require('fs');

const readTuringMachine = (file) => {
  const tm = fs.readFileSync(file, 'utf-8');
  const deltaFunctions = [];
  tm.split('\n').forEach((line) => {
    const parsedLine = /([^\s]+) ([^\s]+) -> ([^\s]+) ([^\s]+) ([^\s]+)/.exec(line);

    if (parsedLine) {
      deltaFunctions.push({
        fromSymbol: parsedLine[1],
        fromState: parsedLine[2],
        toSymbol: parsedLine[3],
        toState: parsedLine[4],
        shift: parsedLine[5],
      });
    }
  });

  return {
    deltaFunctions,
  };
};

const writeGrammar = (file, grammar, cb) => {
  const writeStream = fs.createWriteStream(file);
  Object.keys(grammar).forEach((key) => {
    const value = grammar[key];
    if (Array.isArray(value)) {
      value.forEach((val) => {
        writeStream.write(`${key} -> ${val}\r\n`);
      });
    } else {
      writeStream.write(`${key} -> ${value}\r\n`);
    }
  });
  writeStream.end(cb);
};

module.exports = {
  readTuringMachine,
  writeGrammar,
};
