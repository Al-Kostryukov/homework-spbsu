const Helper = require('./helper.js');
const RFAGrammar = require('./rfa-grammar.js');


class Graph {
  //@param graphAsString <string>
  constructor(graphAsString) {
    this.graphStructure = this.parse(graphAsString);
  }

  //@param graphAsString <string>
  parse(graphAsString) {
    const graphStructure = [],
          lines = graphAsString.split(/\r?\n/),
          regexp = /(\d+).*label\s*=\s*"(.+?)"/;
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
      graphStructure[vertex1] = [];
    }


    let pushed = false;


    let outForVertex1Labels = Helper.findArrayByFirstElem(graphStructure[vertex1], vertex2);
    if (outForVertex1Labels == null) {
      graphStructure[vertex1].push([vertex2, [label]]);
      pushed = true;
    } else if (outForVertex1Labels[1].indexOf(label) < 0) {
      outForVertex1Labels[1].push(label);
      pushed = true;
    }

    return pushed;
  }
}

class GSS {
  constructor(node) {
    this.nodes = {};
    this.nodes[node.toString()] = []
  }

  addNode(fromA, to, label) {
    let from = fromA.toString();
    if (this.nodes.hasOwnProperty(from)) {
      this.nodes[from].push([to, label]);
    } else {
      this.nodes[from] = [[to, label]];
    }
  }

  getNode(node) {
    return this.nodes[node.toString()];
  }
}

module.exports = class TopDownSolver {
  static start(rfaGrammarAsString, graphAsString) {
    const rfaGrammar = new RFAGrammar(rfaGrammarAsString);
    const graph = new Graph(graphAsString);
    return this.solve(rfaGrammar, graph);
  }

  static solve(rfaGrammar, graph) {
    const graphStructure = graph.graphStructure,
          rfa = rfaGrammar.rfa,
          result = [];

    for (let graphVertex = 0; graphVertex < graphStructure.length; graphVertex++) {
      if (graphStructure[graphVertex] !== undefined) {
        for (let nonTerminal in rfa.startStates) {
          if (rfa.startStates.hasOwnProperty(nonTerminal)) {
            for (let rfaVertex of rfa.startStates[nonTerminal]) {
              let gss = new GSS([graphVertex, nonTerminal]),
                  curConfigs = [[graphVertex, rfaVertex, [graphVertex, nonTerminal]]],
                  milledConfigs = [],
                  popped = [],
                  poppedStates = {};

              while (curConfigs.length) {
                let curConfig = curConfigs.pop();
                milledConfigs.push(curConfig);
                let [graphPos, grammarPos, curGSSNode] = curConfig;

                //equal terminals case
                //needed curConfig, graphStructure, rfa.graph
                if (rfa.graph[grammarPos] !== undefined && graphStructure[graphPos] !== undefined) {
                  for (let outRfaVertexAndLabels of rfa.graph[grammarPos]) {
                    for (let outGraphVertexAndLabels of graphStructure[graphPos]) {
                      //intersect
                      let i = Helper.intersect(outRfaVertexAndLabels[1], outGraphVertexAndLabels[1]);
                      if (i.length > 0) {
                        let newConfig = [outGraphVertexAndLabels[0], outRfaVertexAndLabels[0], curGSSNode];
                        this.addNewConfiguration(curConfigs, milledConfigs, newConfig);
                      }
                    }
                  }
                }


                //call nonTerminal case
                if (rfa.graph[grammarPos] !== undefined) {
                  for (let outRfaVertexAndLabels of rfa.graph[grammarPos]) {
                    for (let label of outRfaVertexAndLabels[1]) {
                        if (RFAGrammar.isNonTerminal(label)) {
                          for (let startPos of rfa.startStates[label]) {
                            let newGSSNode = [graphPos, label],
                                newConfig = [graphPos, startPos, newGSSNode];

                            if (Helper.isPairInArray(popped, newGSSNode)) {
                              this.pop(curConfigs, milledConfigs, poppedStates, newGSSNode, curGSSNode, outRfaVertexAndLabels[0])

                            }
                            this.addNewConfiguration(curConfigs, milledConfigs, newConfig);
                            gss.addNode(newGSSNode, curGSSNode, outRfaVertexAndLabels[0])
                          }

                      }
                    }
                  }
                }


                //grammar final state case
                if (rfa.nonTermToFinalStates[curGSSNode[1]].indexOf(grammarPos) > -1) {
                  this.popGSS(result, curConfigs, milledConfigs, gss, poppedStates, curGSSNode, graphPos);
                  popped.push(curGSSNode);
                }
              }
            }
          }
        }
      }
    }

    let resultFinal = [];
    for (let res of result) {
      resultFinal.push(res.join(","));
    }
    return resultFinal;
  }

  static addNewConfiguration(curConfigs, milledConfigs, newConfig) {
    for (let config of milledConfigs) {
      if (config[0] == newConfig[0] && config[1] == newConfig[1] && config[2][0] == newConfig[2][0] && config[2][1] == newConfig[2][1]) {
        return;
      }
    }

    curConfigs.push(newConfig);
  }

  static pop(curConfigs, milledConfigs, poppedStates, poppedGSSNode, curGSSNode, vertex) {
    let poppedStr = poppedGSSNode.toString();
    if (poppedStates.hasOwnProperty(poppedStr)) {
      for (let graphPos of poppedStates[poppedStr]) {

        this.addNewConfiguration(curConfigs, milledConfigs, [graphPos, vertex, curGSSNode]);
      }
    }
  }

  static popGSS(result, curConfigs, milledConfigs, gss, poppedStates, curGSSNode, graphPos) {
    let nodesAndVertexes = gss.getNode(curGSSNode),
        curGSSNodeStr = curGSSNode.toString();
    if (poppedStates.hasOwnProperty(curGSSNodeStr)) {
      poppedStates[curGSSNodeStr].push(graphPos)
    } else {
      poppedStates[curGSSNodeStr] = [graphPos];
    }

    for (let nodeAndVertex of nodesAndVertexes) {
      for (let graphPos of poppedStates[curGSSNodeStr]) {

        this.addNewConfiguration(curConfigs, milledConfigs, [graphPos, nodeAndVertex[1], nodeAndVertex[0]])
      }
    }

    let res = [curGSSNode[0], curGSSNode[1], graphPos];
    if (Helper.indexOfArray3(result, res) < 0) {
      result.push(res);
    }
  }
}
