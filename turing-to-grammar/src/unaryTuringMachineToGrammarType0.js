const helpers = require('./helpers');
const constants = require('./constants');
const generatePrimes = require('./generatePrimes');

try {
  const { deltaFunctions } = helpers.readTuringMachine('utm0.txt');
  const {
    EPS,
    BLANK,
  } = constants;

  const turingMachine = {
    tapeSymbols: [
      '1', '$', '#', BLANK,
    ],
    inputSymbols: ['1'],
    deltaFunctions,
    startState: 'Q0',
    acceptState: 'Qf',
    leftShiftSymbol: 'L',
    rightShiftSymbol: 'R',
  };

  const grammar = {};
  grammar.A1 = [`[${EPS},${BLANK}](${turingMachine.startState})A2`];
  grammar.A2 = [];
  turingMachine.inputSymbols.forEach((a) => {
    grammar.A2.push(`[${a},${a}]A2`);
  });
  grammar.A2.push('A3');
  grammar.A3 = [];
  grammar.A3.push(`[${EPS},${BLANK}]A3`, EPS);

  turingMachine.deltaFunctions
    .filter(deltaFunction => (deltaFunction.shift === turingMachine.rightShiftSymbol))
    .forEach((deltaFunction) => {
      turingMachine.inputSymbols.concat(EPS).forEach((a) => {
        const from = `(${deltaFunction.fromState})[${a},${deltaFunction.fromSymbol}]`;
        const to = `[${a},${deltaFunction.toSymbol}](${deltaFunction.toState})`;
        (grammar[from] = grammar[from] || []).push(to);
      });
    });

  turingMachine.deltaFunctions
    .filter(deltaFunction => (deltaFunction.shift === turingMachine.leftShiftSymbol))
    .forEach((deltaFunction) => {
      turingMachine.inputSymbols.concat(EPS).forEach((a) => {
        turingMachine.inputSymbols.concat(EPS).forEach((b) => {
          turingMachine.tapeSymbols.forEach((E) => {
            const from = `[${b},${E}](${deltaFunction.fromState})[${a},${deltaFunction.fromSymbol}]`;
            const to = `(${deltaFunction.toState})[${b},${E}][${a},${deltaFunction.toSymbol}]`;
            (grammar[from] = grammar[from] || []).push(to);
          });
        });
      });
    });

  turingMachine.inputSymbols.concat(EPS).forEach((a) => {
    turingMachine.tapeSymbols.forEach((C) => {
      const from1 = `[${a},${C}](${turingMachine.acceptState})`;
      const from2 = `(${turingMachine.acceptState})[${a},${C}]`;
      const to = `(${turingMachine.acceptState})${a}(${turingMachine.acceptState})`;

      (grammar[from1] = grammar[from1] || []).push(to);
      (grammar[from2] = grammar[from2] || []).push(to);
    });
  });

  grammar[`(${turingMachine.acceptState})`] = [EPS];

  helpers.writeGrammar('ugrammar0.txt', grammar, () => {
    console.log('Writing to ugrammar0.txt done!');
    generatePrimes(grammar);
  });
} catch (e) {
  console.log(e);
}
