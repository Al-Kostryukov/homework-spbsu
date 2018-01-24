const Helper = require('./helper.js');


class HomskyGrammar {
  //@param grammarAsString <string>
  constructor(grammarAsString) {
    this.productions = this.parse(grammarAsString); //reversed: A -> BC will be this.productions['BC'] = 'A'
    this.productionsWithTerminals = {}; //only with terminals
    this.productionsWithoutTerminals = {};
    for (let right in this.productions) {
      if (this.productions.hasOwnProperty(right)) {
        if (HomskyGrammar.isTerminal(right)) {
          this.productionsWithTerminals[right] = this.productions[right];
        } else {
          this.productionsWithoutTerminals[right] = this.productions[right];
        }
      }
    }
  }

  //@param grammarAsString <string>
  parse(grammarAsString) {
    let hashMap = {},
        lines = grammarAsString.split(/\r?\n/);
    for (let line of lines) {
      if (line.length > 0) {
        let [left, right] = line.split(':');
        let rightSplitted = right.split('|');
        for (let rs of rightSplitted) {
          let rsTrimmed = rs.replace(/\s+/g, ' ').trim(),
              lsTrimmed = left.trim();
          if (hashMap.hasOwnProperty(rsTrimmed)) {
            hashMap[rsTrimmed] = [hashMap[rsTrimmed]];
            hashMap[rsTrimmed].push(lsTrimmed);
          } else {
            hashMap[rsTrimmed] = lsTrimmed;
          }
        }
      }
    }

    return hashMap;
  }

  static isTerminal(str) {
    return str[0] == str[0].toLowerCase()
  }

  static isNonTerminal(str) {
    return isNaN(str[0] * 1) && str[0] == str[0].toUpperCase()
  }
}

class Graph {
  //@param graphAsString <string>
  constructor(graphAsString) {
    this.graphStructure = this.parse(graphAsString);
  }

  //@param graphAsString <string>
  parse(graphAsString) {
    let graphStructure = [],
        lines = graphAsString.split(/\r?\n/),
        regexp = /(\d+).*label\s*=\s*"(.+?)"/
    for (let line of lines) {
      if (line.length > 0 && line.indexOf('->') > -1) {
        let [left, right] = line.split('->'),
            vertex1 = parseInt(left),
            rightMatched = right.match(regexp),
            vertex2 = parseInt(rightMatched[1]),
            label = rightMatched[2];

        this.addEdge(vertex1, vertex2, label, graphStructure);
      }
    }

    return graphStructure;
  }

  addEdge(vertex1, vertex2, label, graphStructure) {
    if (!graphStructure) {
      graphStructure = this.graphStructure;
    }

    if (graphStructure[vertex1] === undefined) {
      graphStructure[vertex1] = [[], []];
    }

    if (graphStructure[vertex2] === undefined) {
      graphStructure[vertex2] = [[], []];
    }

    let pushed = false;

    //graphStructure[vertex1][1] - out, graphStructure[vertex1][0] - in
    let outForVertex1Labels = Helper.findArrayByFirstElem(graphStructure[vertex1][1], vertex2);
    if (outForVertex1Labels == null) {
      graphStructure[vertex1][1].push([vertex2, [label]]);
      pushed = true;
    } else if (outForVertex1Labels[1].indexOf(label) < 0) {
      outForVertex1Labels[1].push(label);
      pushed = true;
    }

    let inForVertex2Labels = Helper.findArrayByFirstElem(graphStructure[vertex2][0], vertex1);
    if (inForVertex2Labels == null) {
      graphStructure[vertex2][0].push([vertex1, [label]]);
      pushed = true;
    } else if (inForVertex2Labels[1].indexOf(label) < 0) {
      inForVertex2Labels[1].push(label);
      pushed = true;
    }

    return pushed;
  }
}



module.exports = class MatrixSolver {
  static start(grammarAsString, graphAsString) {
    const grammar = new HomskyGrammar(grammarAsString);
    const graph = new Graph(graphAsString);
    return this.solve(grammar, graph);
  }

  static solve(grammar, graph) {
    const graphStructure = graph.graphStructure,
          timeStart = Date.now();

    Helper.smartLog(1, "0 ms: Replacing terminals with nonterminals");

    for (let vertexInfo of graphStructure) {
      if (vertexInfo !== undefined) {
        for (let inOut of vertexInfo) {
          for (let vertexAndLabels of inOut) {
            const labels = vertexAndLabels[1],
                  l = labels.length;

            for (let i = 0; i < l; i++) {
              if (grammar.productionsWithTerminals.hasOwnProperty(labels[i])) {
                let terminal = labels[i];
                if (Array.isArray(grammar.productionsWithTerminals[terminal])) {
                  labels[i] = grammar.productionsWithTerminals[terminal][0];
                  for (let k = 1; k < grammar.productionsWithTerminals[terminal].length; k++) {
                    labels.push(grammar.productionsWithTerminals[terminal][k])
                  }
                } else {
                  labels[i] = grammar.productionsWithTerminals[terminal];
                }
              }
            }
          }
        }
      }
    }

    Helper.smartLog(1, (Date.now() - timeStart).toString(), "ms: Replaced terminals with nonterminals");

    let smthChanged = true;
    while (smthChanged) {
      smthChanged = false;

      for (let v2 = 0; v2 < graphStructure.length; v2++) {
        if (graphStructure[v2] !== undefined) {
          for (let inVertexAndLabels of graphStructure[v2][0]) {
            for (let outVertexAndLabels of graphStructure[v2][1]) {
              for (let label1 of inVertexAndLabels[1]) {
                for (let label2 of outVertexAndLabels[1]) {
                  const right = label1 + " " + label2;
                  if (grammar.productionsWithoutTerminals.hasOwnProperty(right)) {
                    const v1 = inVertexAndLabels[0],
                          v3 = outVertexAndLabels[0];

                    Helper.smartLog(1, (Date.now() - timeStart).toString(), "ms:",
                                "Found transitive closure",
                                v1, "-(" + label1 + ")->", v2, "-(" + label2 + ")->", v3, "&",
                                "trying to add", v1, "-(" + grammar.productionsWithoutTerminals[right] + ")->", v3,
                                "because of", grammar.productionsWithoutTerminals[right], "->", right,
                                "& Working on...");


                    if (Array.isArray(grammar.productionsWithoutTerminals[right])) {
                      for (let left of grammar.productionsWithoutTerminals[right]) {
                        let pushed = graph.addEdge(v1, v3, left);
                        if (pushed) {
                          smthChanged = true;
                        }
                      }
                    } else {
                      let pushed = graph.addEdge(v1, v3, grammar.productionsWithoutTerminals[right]);
                      if (pushed) {
                        smthChanged = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    const result = [];
    for (let v1 = 0; v1 < graphStructure.length; v1++) {
      if (graphStructure[v1] !== undefined) {
        let out = graphStructure[v1][1];
        for (let o of out) {
          let v2 = o[0];
          for (let label of o[1]) {
            if (HomskyGrammar.isNonTerminal(label)) {
              result.push(v1 + "," + label + "," + v2);
            }
          }
        }
      }
    }

    return result
  }
}
