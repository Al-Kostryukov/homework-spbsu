const eol = require("os").EOL;
const Helper = require('./helper.js');
const IO = require('./io.js');
const MatrixSolver = require('./matrix.js');
const BottomUpSolver = require('./bottomup.js');
const TopDownSolver = require('./topdown.js');

module.exports = class Connector {
  static start(type, grammarFilePath, graphFilePath, returnResult, outputFilePath) {
    if (!grammarFilePath || !graphFilePath) {
      console.error("\x1b[41m%s\x1b[0m", "Error: Please specify arguments correctly!");
      return;
    }

    try {
      let grammarAsString = IO.readFile(grammarFilePath);

      Helper.smartLog(1, "Grammar file", grammarFilePath ,"was loaded");

      let graphAsString = IO.readFile(graphFilePath);

      Helper.smartLog(1, "Graph file", graphFilePath, "was loaded");

      Helper.wait();

      let result;
      if (type === "matrix") {
        result = MatrixSolver.start(grammarAsString, graphAsString);
      } else if (type === "bottomup") {
        result = BottomUpSolver.start(grammarAsString, graphAsString);
      } else if (type === "topdown") {
        result = TopDownSolver.start(grammarAsString, graphAsString);
      } else {
        console.error("\x1b[41m%s\x1b[0m", "Error: Please specify arguments correctly!");
        return;
      }

      if (returnResult) {
        return result;
      }

      if (outputFilePath) {
        Helper.smartLog(0, "Saving the result into", outputFilePath);
        IO.writeFile(outputFilePath, result.join(eol));
        Helper.smartLog(0, "The result was successfuly saved!");
      } else {
        Helper.smartLog(0, "The result:");
        Helper.smartLog(0, result.join(eol));
      }

    } catch (e) {
      throw e;
    }
  }
}
