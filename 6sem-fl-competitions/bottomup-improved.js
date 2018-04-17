class RFAGrammar {
    //@param grammarAsString <string>
    constructor(rfaGrammarAsString) {
        this.rfa = this.parse(rfaGrammarAsString); //reversed: A -> BC will be this.productions['BC'] = 'A'
    }

    //@param rfaGrammarAsString <string>
    parse(rfaGrammarAsString) {
        let rfa = {
                startStates: new Map(),
                finalStatesToNonTerm: new Map(),
                graph: [],
                outLabels: []
            },
            lines = rfaGrammarAsString.split(/\r?\n/),
            regexpLabel = /(\d+).*label\s*=\s*"(.+?)"/,
            regexpFinalState = /shape\s*=\s*"doublecircle"/,
            regexpStartState = /color\s*=\s*"green"/;

        for (let line of lines) {
            if (line.length > 0) {
                if (line.indexOf('->') > -1) {
                    let [left, right] = line.split('->'),
                        vertex1 = parseInt(left),
                        rightMatched = right.match(regexpLabel),
                        vertex2 = parseInt(rightMatched[1]),
                        label = rightMatched[2];

                    this.addEdge(vertex1, vertex2, label, rfa);
                } else if (/\d+\[/.test(line)) {
                    let matched = line.match(regexpLabel),
                        vertex = parseInt(matched[1]),
                        label = matched[2];

                    if (regexpFinalState.test(line)) {
                        if (rfa.finalStatesToNonTerm.has(vertex)) {
                            rfa.finalStatesToNonTerm.get(vertex).add(label);
                        } else {
                            rfa.finalStatesToNonTerm.set(vertex, new Set([label]));
                        }
                    }

                    if (regexpStartState.test(line)) {
                        if (rfa.startStates.has(label)) {
                            rfa.startStates.get(label).add(vertex);
                        } else {
                            rfa.startStates.set(label, new Set([vertex]));
                        }
                    }
                }
            }
        }

        return rfa;
    }

    addEdge(vertex1, vertex2, label, rfa) {
        if (rfa.outLabels[vertex1] == null) {
            rfa.outLabels[vertex1] = 0 | (1 << Helper.hash(label));
            rfa.graph[vertex1] = new Map();
        } else {
            rfa.outLabels[vertex1] |= (1 << Helper.hash(label));
        }

        let outForVertex1Labels = rfa.graph[vertex1].get(vertex2);
        if (outForVertex1Labels == null) {
            rfa.graph[vertex1].set(vertex2, new Set([label]));
        } else {
            outForVertex1Labels.add(label);
        }
    }

    static isNonTerminal(str) {
        return isNaN(str[0] * 1) && str[0] == str[0].toUpperCase()
    }
}



class Helper {
    static hasIntersectionSetAndSet(set1, set2) {
        for (let el of set1) {
            if (set2.has(el)) {
                return true;
            }
        }

        return false
    }

    //hashing
    static hash(str) {
        let sum = str.charCodeAt(0);
        // for (let i = 0; i < str.length; i++) {
        //     sum += str.charCodeAt(i);
        // }
        //console.log(str, sum);
        return sum % 11;
    }
}


class Graph {
  //@param graphAsString <string>
  constructor(graphAsString) {
    this.graphStructure = [];
    this.outLabels = [];
    this.parse(graphAsString);
  }

  //@param graphAsString <string>
  parse(graphAsString) {
    const lines = graphAsString.split(/\r?\n/),
          regexp = /(\d+).*label\s*=\s*"(.+?)"/;
    for (let line of lines) {
      if (line.length > 0 && line.indexOf('->') > -1) {
        let [left, right] = line.split('->'),
            vertex1 = parseInt(left),
            rightMatched = right.match(regexp),
            vertex2 = parseInt(rightMatched[1]),
            label = rightMatched[2];

        this.addEdge(vertex1, vertex2, label);
      }
    }
  }

  addEdge(vertex1, vertex2, label) {
      if (this.outLabels[vertex1] == null) {
          this.outLabels[vertex1] = 0 | (1 << Helper.hash(label));
          this.graphStructure[vertex1] = new Map();
      } else {
          this.outLabels[vertex1] |= (1 << Helper.hash(label));
      }

    //let pushed = false;


    let outForVertex1Labels = this.graphStructure[vertex1].get(vertex2);
    if (outForVertex1Labels == null) {
      this.graphStructure[vertex1].set(vertex2, new Set([label]));
      return true;
    } else if (!outForVertex1Labels.has(label)) {
      outForVertex1Labels.add(label);
      return true;
    }

    return false;
  }
}



module.exports = class BottomUpSolver {
  static start(rfaGrammarAsString, graphAsString) {
    const rfaGrammar = new RFAGrammar(rfaGrammarAsString);
    const graph = new Graph(graphAsString);
    return this.solve(rfaGrammar, graph);
  }

  static solve(rfaGrammar, graph) {
      let time1 = Date.now();
    const graphStructure = graph.graphStructure,
          rfa = rfaGrammar.rfa;

    let smthChanged = true;
    while (smthChanged) {
      smthChanged = false;

      for (let graphVertex = 0; graphVertex < graphStructure.length; graphVertex++) {
        if (graphStructure[graphVertex] != null) {
          for (let [nonTerminal, rfaVertexes] of rfa.startStates) {
            for (let rfaVertex of rfaVertexes) {
              smthChanged |= this.traverse(rfa, graph, [rfaVertex, graphVertex], nonTerminal);
            }
          }
        }
      }
    }



    const result = [];
    for (let v1 = 0; v1 < graphStructure.length; v1++) {
      if (graphStructure[v1] != null) {
        for (let o of graphStructure[v1]) {
           for (let label of o[1]) {
            if (RFAGrammar.isNonTerminal(label)) {
              result.push(v1 + "," + label + "," + o[0]);
            }
          }
        }
      }
    }
    console.log("time: ", Date.now() - time1);
    return result
  }

  static traverse(rfa, graph, startPair, nonTerminal) {
    let smthChanged = false;
    const graphStructure = graph.graphStructure,
        workingPairs = [startPair],
        milledPairs = new Set([startPair[0] * 1e12 + startPair[1]]);

    while (workingPairs.length) {
      let [rfaVertex, graphVertex] = workingPairs.pop(),
          finalNonTerms = rfa.finalStatesToNonTerm.get(rfaVertex);


      if (finalNonTerms != null && finalNonTerms.has(nonTerminal)) {
          smthChanged |= graph.addEdge(startPair[1], graphVertex, nonTerminal);
      }


      if (rfa.graph[rfaVertex] != null && graphStructure[graphVertex] != null &&
          rfa.outLabels[rfaVertex] & graph.outLabels[graphVertex]) {
        for (let outRfaVertexAndLabels of rfa.graph[rfaVertex]) {
          for (let outGraphVertexAndLabels of graphStructure[graphVertex]) {
            //intersect

            if (Helper.hasIntersectionSetAndSet(outRfaVertexAndLabels[1], outGraphVertexAndLabels[1])) {
                let potentialToAdd = [outRfaVertexAndLabels[0], outGraphVertexAndLabels[0]];
                let key = potentialToAdd[0] * 1e12 + potentialToAdd[1];
                if (!milledPairs.has(key)) {
                    workingPairs.push(potentialToAdd);
                    milledPairs.add(key);
                }
            }
          }
        }
      }

    }

    return smthChanged;
  }
}
