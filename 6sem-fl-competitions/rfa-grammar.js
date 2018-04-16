const Helper = require('./helper.js');

module.exports = class RFAGrammar {
  //@param grammarAsString <string>
  constructor(rfaGrammarAsString) {
    this.rfa = this.parse(rfaGrammarAsString); //reversed: A -> BC will be this.productions['BC'] = 'A'
  }

  //@param rfaGrammarAsString <string>
  parse(rfaGrammarAsString) {
    let rfa = {
          startStates: {},
          nonTermToFinalStates: {},
          finalStatesToNonTerm: {},
          graph: []
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
            if (rfa.nonTermToFinalStates.hasOwnProperty(label)) {
              rfa.nonTermToFinalStates[label].push(vertex);
            } else {
              rfa.nonTermToFinalStates[label] = [vertex];
            }

            if (rfa.finalStatesToNonTerm.hasOwnProperty(vertex)) {
              rfa.finalStatesToNonTerm[vertex].push(label);
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

  static isTerminal(str) {
    return str[0] == str[0].toLowerCase()
  }

  static isNonTerminal(str) {
    return isNaN(str[0] * 1) && str[0] == str[0].toUpperCase()
  }
}
