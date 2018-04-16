const Helper = require('./helper.js');
const RFAGrammar = require('./rfa-grammar.js');


class Graph {
  //@param graphAsString <string>
  constructor(graphAsString) {
    this.graphStructure = this.parse(graphAsString);
  }

  //@param graphAsString <string>
  parse(graphAsString) {
    const graphStructure = [], //adjMatrix here
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
        if (graphStructure[graphVertex] !== undefined) {
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
      if (graphStructure[v1] !== undefined) {
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
    let smthChanged = false,
        graphStructure = graph.graphStructure,
        workingPairs = [startPair],
        milledPairs = [];

    while (workingPairs.length) {
      let [rfaVertex, graphVertex] = workingPairs.pop();
          milledPairs.push(startPair);


      if (rfa.finalStatesToNonTerm.hasOwnProperty(rfaVertex) && rfa.finalStatesToNonTerm[rfaVertex].indexOf(nonTerminal) > -1) {
          smthChanged |= graph.addEdge(startPair[1], graphVertex, nonTerminal);
      }


      if (rfa.graph[rfaVertex] !== undefined && graphStructure[graphVertex] !== undefined) {
        for (let outRfaVertexAndLabels of rfa.graph[rfaVertex]) {
          for (let outGraphVertexAndLabels of graphStructure[graphVertex]) {
            //intersect
            let i = Helper.intersect(outRfaVertexAndLabels[1], outGraphVertexAndLabels[1]);
            let potentialToAdd = [outRfaVertexAndLabels[0], outGraphVertexAndLabels[0]];
            if (i.length > 0 && !Helper.inArray2(milledPairs, potentialToAdd)) {
              workingPairs.push(potentialToAdd);
            }
          }
        }
      }

    }

    return smthChanged;
  }
}
