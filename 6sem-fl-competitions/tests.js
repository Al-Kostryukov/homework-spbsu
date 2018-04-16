const path = require("path");
const Connector = require('./connector.js');
const Helper = require('./helper.js');


const types = {
        "m": "matrix",
        "b": "bottomup",
        "t": "topdown"
      },
      graphFilesDir = path.join('tests', 'graphs'),
      graphFilesPathsBig = [
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
      graphFilesPathsSmall = [
        'mutual-loop.dot',
        'linear.dot',
        '8.dot',
        'random.dot',
        'coprime-cycle.dot'
      ],
      homskyGrammarFilesDir = path.join('tests', 'grammars', 'homsky'),
      rfaGrammarFilesDir = path.join('tests', 'grammars', 'rfa'),
      homskyGrammarFilesPathsBig = [
        'Q1-homsky.txt',
        'Q2-homsky.txt',
        'Q3-homsky.txt'
      ],
      rfaGrammarFilesPathsBig = [
        'Q1-rfa.dot',
        'Q2-rfa.dot',
        'Q3-rfa.dot'
      ],
      homskyGrammarFilesPathsSmall = [
        'a-star-b.txt',
        'an-bn.txt'
      ],
      rfaGrammarFilesPathsSmall = [
        'a-star-b.dot',
        'an-bn.dot',
        'random.dot',
        'plus.dot',
        'coprime-cycle.dot'
      ],
      trueResultsBig = [
      //skos, gene, trav, univ, atom , biome, foaf, peop, fund , wine , pizza
        [810, 2164, 2499, 2540, 15454, 15156, 4118, 9472, 17634, 66572, 56195],//Q1
        [1  , 0   , 63  , 81  , 122  , 2871 , 10  , 37  , 1158 , 133  , 1262 ],//Q2
        [32 , 19  , 31  , 12  , 3    , 0    , 46  , 36  , 18   , 1215 , 9520 ]//Q3
      ],
      trueResultsSmall = [
        [12, 0, 1, 2, 6], //a-star-b
        [2, 0, 0, 2, 12], //an-bn
        [0, 0, 0, 0, 0], //random.dot
        [0, 0, 0, 0, 0], //plus
        [8, 3, 1, 2, 6] //coprime-cycle
      ];

class Test {
  static start(t, small) {
    if (!types.hasOwnProperty(t)) {
      Helper.smartLog(0, Helper.c("Error! No such type of algorithm! Specify it in such way: node test.js [type], where [type] is m, b or t", "redBg"));
      return;
    }

    let homskyGrammarFilesPaths, rfaGrammarFilesPaths, graphFilesPaths, trueResults;

    if (small) {
      homskyGrammarFilesPaths = homskyGrammarFilesPathsSmall;
      rfaGrammarFilesPaths = rfaGrammarFilesPathsSmall;
      graphFilesPaths = graphFilesPathsSmall;
      trueResults = trueResultsSmall;
    } else {
      homskyGrammarFilesPaths = homskyGrammarFilesPathsBig;
      rfaGrammarFilesPaths = rfaGrammarFilesPathsBig;
      graphFilesPaths = graphFilesPathsBig;
      trueResults = trueResultsBig;
    }

    let type = types[t],
        grammarFilesDir = type == "matrix" ? homskyGrammarFilesDir : rfaGrammarFilesDir,
        grammarFilesPaths = type == "matrix" ? homskyGrammarFilesPaths : rfaGrammarFilesPaths;

    let testsCount = grammarFilesPaths.length * graphFilesPaths.length,
        testI = 0,
        timeStart = Date.now();
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
                          Helper.c(trueResults[i][j] + " (expected result)", "cyanBg"));
          Helper.wait();
        } else {
          Helper.smartLog(0, Helper.timeSpentFormatted(timeStart, 10, "red"), testI, "/", testsCount,
                          Helper.c("failed!", "red"),
                          Helper.c("(result) " + count, "redBg"),
                          "!=",
                          Helper.c(trueResults[i][j] + " (expected result)", "cyanBg"));
          Helper.smartLog(0, Helper.timeSpentFormatted(timeStart, 10, "red"),
                          Helper.c("Failed on test #" + testI + ":", "redBg"),
                          Helper.c("Grammar: " + grammarFilesPaths[i], "yellow"),
                          Helper.c("Graph: " + graphFilesPaths[j], "cyan"));
          return false;
        }
      }
    }

    Helper.smartLog(0, Helper.timeSpentFormatted(timeStart, 10, "green"), Helper.c("All tests for " + type + " algorithm passed!", "greenBg"));
    return true;
  }

  static startAll(small, timeStartPrev) {
    let timeStart = timeStartPrev ? timeStartPrev : Date.now();

    if (small) {
      Helper.smartLog(0, "\nRunning SMALL tests...");
    } else {
      Helper.smartLog(0, "\nRunning BIG tests...");
    }

    let status;

    Helper.smartLog(0, Helper.timeSpentFormatted(timeStart, 10, "yellowBg"), "Running tests for matrix algorithm...");
    status = Test.start("m", small);
    if (!status) {
      return 0;
    }


    Helper.smartLog(0, "\n" + Helper.timeSpentFormatted(timeStart, 10, "yellowBg"), "Running tests for bottomup algorithm...");
    status = Test.start("b", small);
    if (!status) {
      return 0;
    }

    Helper.smartLog(0, "\n" + Helper.timeSpentFormatted(timeStart, 10, "yellowBg"), "Running tests for topdown algorithm...");
    status = Test.start("t", small);
    if (!status) {
      return 0;
    }

    Helper.smartLog(0, "\n" + Helper.timeSpentFormatted(timeStart, 10, "yellowBg"), "All " + (small ? "SMALL" : "BIG") + " tests passed!");

    return timeStart;
  }
}


let args = process.argv.slice(2),
    type = args[0];

if (type == "small") {
  Test.startAll(true)
} else if (type == "all") {
  Helper.smartLog(0, "Running ALL tests: SMALL and BIG...");
  let prevTime = Test.startAll(true);
  if (prevTime > 0) {
    let res = Test.startAll(false, prevTime)
    if (res) {
      Helper.smartLog(0, "ALL tests passed...");
    }
  }
} else {
  Test.start(type);
}
