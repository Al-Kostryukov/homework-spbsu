const path = require("path");
const Connector = require('./connector.js');
const Helper = require('./helper.js');


const types = {
        "m": "matrix",
        "b": "bottomup",
        "t": "topdown"
      },
      graphFilesDir = path.join('tests', 'graphs'),
      graphFilesPaths = [
        'skos.dot',
        'generations.dot',
        'travel.dot',
        'univ-bench.dot',
        'atom-primitive.dot',
        'biomedical-mesure-primitive.dot',
        'foaf.dot',
        'people_pets.dot',
        'funding.dot',
        'wine.dot',
        'pizza.dot'
      ],
      homskyGrammarFilesDir = path.join('tests', 'grammars', 'homsky'),
      rfaGrammarFilesDir = path.join('tests', 'grammars', 'rfa'),
      homskyGrammarFilesPaths = [
        'Q1-homsky.txt',
        'Q2-homsky.txt',
        'Q3-homsky.txt'
      ],
      rfaGrammarFilesPaths = [
        'Q1-rfa.txt',
        'Q2-rfa.txt',
        'Q3-rfa.txt'
      ],
      trueResults = [
      //skos, gene, trav, univ, atom , biome, foaf, peop, fund , wine , pizza
        [810, 2164, 2499, 2540, 15454, 15156, 4118, 9472, 17634, 66572, 56195],//Q1
        [1  , 0   , 63  , 81  , 122  , 2871 , 10  , 37  , 1158 , 133  , 1262 ],//Q2
        [32 , 19  , 31  , 12  , 3    , 0    , 46  , 36  , 18   , 1215 , 9520 ]//Q3
      ];

class Test {
  static startBig(t) {
    if (!types.hasOwnProperty(t)) {
      Helper.smartLog(0, Helper.c("Error! No such type of algorithm! Specify it in such way: node test.js [type], where [type] is m, b or t", "redBg"));
      return;
    }

    let type = types[t],
        grammarFilesDir = type == "matrix" ? homskyGrammarFilesDir : rfaGrammarFilesDir,
        grammarFilesPaths = type == "matrix" ? homskyGrammarFilesPaths : rfaGrammarFilesPaths;

    let testsCount = grammarFilesPaths.length * graphFilesPaths.length,
        testI = 0,
        timeStart = Date.now()
    for (let i = 0; i < grammarFilesPaths.length; i++) {
      for (let j = 0; j < graphFilesPaths.length; j++) {
        testI++;
        Helper.smartLog(0, Helper.timeSpentFormatted(timeStart, 10, "blue"),
                        testI, "/", testsCount,
                        Helper.c("Grammar: " + grammarFilesPaths[i], "yellow"),
                        Helper.c("Graph: " + graphFilesPaths[j], "cyan"),
                        "running...");
        Helper.wait();

        let grammarFilePath = path.join(grammarFilesDir, grammarFilesPaths[i]),
            graphFilePath = path.join(graphFilesDir, graphFilesPaths[j]);

        let result = Connector.start(type, grammarFilePath, graphFilePath, true);

        let count = 0;
        for (let r of result) {
          let res = r.split(",");
          if (res[1] == "S") {
            count++
          }
        }

        if (count == trueResults[i][j]) {
          Helper.smartLog(0, Helper.timeSpentFormatted(timeStart, 10, "green"), testI, "/", testsCount,
                          Helper.c("passed!", "green"),
                          Helper.c("(result) " + count, "greenBg"),
                          "==",
                          Helper.c(trueResults[i][j] + " (true result)", "cyanBg"));
          Helper.wait();
        } else {
          Helper.smartLog(0, Helper.timeSpentFormatted(timeStart, 10, "red"), testI, "/", testsCount,
                          Helper.c("failed!", "red"),
                          Helper.c("(result) " + count, "redBg"),
                          "!=",
                          Helper.c(trueResults[i][j] + " (true result)", "cyanBg"));
          Helper.smartLog(0, Helper.timeSpentFormatted(timeStart, 10, "red"),
                          Helper.c("Failed on test #" + testI + ":", "redBg"),
                          Helper.c("Grammar: " + grammarFilesPaths[i], "yellow"),
                          Helper.c("Graph: " + graphFilesPaths[j], "cyan"));
          return;
        }
      }
    }

    Helper.smartLog(0, Helper.timeSpentFormatted(timeStart, 10, "green"), Helper.c("All tests passed!", "greenBg"));
  }

  static startSmall() {

  }
}


let args = process.argv.slice(2),
    type = args[0];

type == "small" ? Test.startSmall() : Test.startBig(type);
