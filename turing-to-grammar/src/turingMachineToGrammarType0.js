const helpers = require('./helpers');
const constants = require('./constants');

try {
  const { deltaFunctions } = helpers.readTuringMachine('tm0.txt');
  const {
    EPS,
    BLANK,
    LEFT_MARKER,
    RIGHT_MARKER,
  } = constants;

  const turingMachine = {
    tapeSymbols: [
      LEFT_MARKER, RIGHT_MARKER, '1_1_0', '0_B_0', '1', '0_B_1', '0_0_1', '0', '0_0_0', '0_0_B', '1_1_1', '1_B_B',
      '0_1_1', '1_0_1', '1_0__1', '1_1_B', '0_1_0', '1_0_0', '0_1_B', '1_B_0', '0_0__1', '1_0_B', '1_B_1', '0_B_B',
    ],
    inputSymbols: ['0', '1', LEFT_MARKER, RIGHT_MARKER],
    deltaFunctions,
    startState: 'Q0',
    acceptState: 'Qk',
    leftShiftSymbol: 'L',
    rightShiftSymbol: 'R',
  };

  const grammar = {};
  grammar.A1 = `(${turingMachine.startState})A2`;
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

  grammar[`(${turingMachine.acceptState})`] = EPS;

  turingMachine.inputSymbols.concat(EPS).forEach((a) => {
    turingMachine.tapeSymbols.forEach((C) => {
      const from1 = `[${a},${C}](${turingMachine.acceptState})`;
      const from2 = `(${turingMachine.acceptState})[${a},${C}]`;
      const to = `(${turingMachine.acceptState})${a}(${turingMachine.acceptState})`;

      (grammar[from1] = grammar[from1] || []).push(to);
      (grammar[from2] = grammar[from2] || []).push(to);
    });
  });

  grammar[`(${turingMachine.acceptState})${RIGHT_MARKER}`] = [EPS];
  grammar[`${LEFT_MARKER}(${turingMachine.acceptState})`] = [EPS];

  helpers.writeGrammar('grammar0.txt', grammar, () => {
    console.log('Done!');
  });
} catch (e) {
  console.log(e);
}
