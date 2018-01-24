const Connector = require('./connector.js');
const Helper = require('./helper.js');

const types = {
        "m": "matrix",
        "b": "bottomup",
        "t": "topdown"
      };

class Analyze {
  static start(t, grammarFilePath, graphFilePath, outputFilePath) {
    if (!types.hasOwnProperty(t)) {
      Helper.smartLog(0, Helper.c("Error! No such type of algorithm! Specify it in such way: node test.js [type], where [type] is m, b or t", "redBg"));
      return;
    }

    Connector.start(types[t], grammarFilePath, graphFilePath, false, outputFilePath);
  }
}


let args = process.argv.slice(2),
    type = args[0],
    grammarFilePath = args[1],
    graphFilePath = args[2],
    outputFilePath = args[3];

Analyze.start(type, grammarFilePath, graphFilePath, outputFilePath);
