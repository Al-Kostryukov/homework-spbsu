class RFAGrammar {
    //@param grammarAsString <string>
    constructor(rfaGrammarAsString) {
        this.rfa = this.parse(rfaGrammarAsString); //reversed: A -> BC will be this.productions['BC'] = 'A'
    }

    //@param rfaGrammarAsString <string>
    parse(rfaGrammarAsString) {
        let rfa = {
                startStates: new Map(),
                nonTermToFinalStates: new Map(),
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
                        if (rfa.nonTermToFinalStates.has(label)) {
                            rfa.nonTermToFinalStates.get(label).add(vertex);
                        } else {
                            rfa.nonTermToFinalStates.set(label, new Set([vertex]));
                        }

                        if (rfa.finalStatesToNonTerm.has(vertex)) {
                            rfa.finalStatesToNonTerm.get(vertex).push(label);
                        } else {
                            rfa.finalStatesToNonTerm[vertex] = [label];
                        }
                    }
                    if (regexpStartState.test(line)) {
                        if (rfa.startStates.hasOwnProperty(label)) {
                            rfa.startStates[label].push(vertex);
                        } else {
                            rfa.startStates[label] = [vertex];
                        }
                    }
                }
            }
        }

        return rfa;
    }

    addEdge(vertex1, vertex2, label, rfa) {
        if (!rfa) {
            rfa = this.rfa;
        }

        if (rfa.outLabels[vertex1] == null) {
            rfa.outLabels[vertex1] = new Set([label]);
        } else {
            rfa.outLabels[vertex1].add(label);
        }

        if (rfa.graph[vertex1] === undefined) {
            rfa.graph[vertex1] = [[vertex2, [label]]]
        } else {
            let outForVertex1Labels = Helper.findArrayByFirstElem(rfa.graph[vertex1], vertex2);
            if (outForVertex1Labels == null) {
                rfa.graph[vertex1].push([vertex2, [label]])
            } else if (outForVertex1Labels[1].indexOf(label) < 0){
                outForVertex1Labels[1].push(label);
            }
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

    static hasIntersectionArrayAndSet2(arr, set) {
        for (let i = 0; i < arr.length; i++) {
            if (set.has(arr[i])) {
                return true;
            }
        }

        return false;
    }

    static findArrayByFirstElem(arr, el) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0] == el) return arr[i];
        }

        return null;
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
          this.outLabels[vertex1] = new Set([label]);
          this.graphStructure[vertex1] = new Map();
      } else {
          this.outLabels[vertex1].add(label);
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
    const graphStructure = graph.graphStructure,
          rfa = rfaGrammar.rfa,
          timeStart = Date.now();

    let smthChanged = true;
    while (smthChanged) {
      smthChanged = false;

      for (let graphVertex = 0; graphVertex < graphStructure.length; graphVertex++) {
        if (graphStructure[graphVertex] != null) {
          for (let nonTerminal in rfa.startStates) {
            if (rfa.startStates.hasOwnProperty(nonTerminal)) {
              for (let rfaVertex of rfa.startStates[nonTerminal]) {
                smthChanged |= this.traverse(rfa, graph, [rfaVertex, graphVertex], nonTerminal);
              }
            }
          }
        }
      }
    }



    const result = [];
    for (let v1 = 0; v1 < graphStructure.length; v1++) {
      if (graphStructure[v1] != null) {
        for (let o of graphStructure[v1]) {
          let v2 = o[0];
          for (let label of o[1]) {
            if (RFAGrammar.isNonTerminal(label)) {
              result.push(v1 + "," + label + "," + v2);
            }
          }
        }
      }
    }

    return result
  }

  static traverse(rfa, graph, startPair, nonTerminal) {
    let smthChanged = false;
    const graphStructure = graph.graphStructure,
        workingPairs = [startPair],
        milledPairs = new Set([startPair[0] * 1e12 + startPair[1]]);

    while (workingPairs.length) {
      let [rfaVertex, graphVertex] = workingPairs.pop();

      if (rfa.finalStatesToNonTerm.hasOwnProperty(rfaVertex) &&
          rfa.finalStatesToNonTerm[rfaVertex].indexOf(nonTerminal) > -1) {
          smthChanged |= graph.addEdge(startPair[1], graphVertex, nonTerminal);
      }


      if (rfa.graph[rfaVertex] != null && graphStructure[graphVertex] != null &&
          Helper.hasIntersectionSetAndSet(rfa.outLabels[rfaVertex], graph.outLabels[graphVertex])) {
        for (let outRfaVertexAndLabels of rfa.graph[rfaVertex]) {
          for (let outGraphVertexAndLabels of graphStructure[graphVertex]) {
            //intersect
            let i = Helper.hasIntersectionArrayAndSet2(outRfaVertexAndLabels[1], outGraphVertexAndLabels[1]);
            if (i) {
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
