const helpers = require('./helpers');
const constants = require('./constants');

try {
  const { deltaFunctions } = helpers.readTuringMachine('tm1.txt');

  const {
    LEFT_MARKER,
    RIGHT_MARKER,
  } = constants;

  const tm = {
    tapeSymbols: [
      '1_1_0', '0_B_0', '1', '0_B_1', '0_0_1', '0', '0_0_0', '0_0_B', '1_1_1', '1_B_B', '0_1_1',
      '1_0_1', '1_0__1', '1_1_B', '0_1_0', '1_0_0', '0_1_B', '1_B_0', '0_0__1', '1_0_B', '1_B_1', '0_B_B',
    ],
    inputSymbols: ['0', '1'],
    deltaFunctions,
    startState: 'Q0',
    acceptState: 'Qk',
    leftShiftSymbol: 'L',
    rightShiftSymbol: 'R',
  };

  const grammar = {};
  grammar.A1 = [];
  tm.inputSymbols.forEach((term) => {
    grammar.A1.push(`[${LEFT_MARKER} ${tm.startState} ${term} ${term} ${RIGHT_MARKER}]`);
  });

  tm.deltaFunctions.forEach((df) => {
    tm.inputSymbols.forEach((a) => {
      if (df.fromSymbol === LEFT_MARKER && df.shift === tm.rightShiftSymbol) {
        tm.tapeSymbols.forEach((X) => {
          let from = `[${df.fromState} ${LEFT_MARKER} ${X} ${a} ${RIGHT_MARKER}]`;
          (grammar[from] = grammar[from] || []).push(`[${LEFT_MARKER} ${df.toState} ${X} ${a} ${RIGHT_MARKER}]`);
          from = `[${df.fromState} ${LEFT_MARKER} ${X} ${a}]`;
          (grammar[from] = grammar[from] || []).push(`[${LEFT_MARKER} ${df.toState} ${X} ${a}]`);
        });
      } else if (df.fromSymbol === RIGHT_MARKER && df.shift === tm.leftShiftSymbol) {
        tm.tapeSymbols.forEach((X) => {
          let from = `[${LEFT_MARKER} ${X} ${a} ${df.fromState} ${RIGHT_MARKER}]`;
          (grammar[from] = grammar[from] || []).push(`[${LEFT_MARKER} ${df.toState} ${X} ${a} ${RIGHT_MARKER}]`);
          from = `[${X} ${a} ${df.fromState} ${RIGHT_MARKER}]`;
          (grammar[from] = grammar[from] || []).push(`[${df.toState} ${X} ${a} ${RIGHT_MARKER}]`);
        });
      } else if (df.shift === tm.leftShiftSymbol) {
        let from = `[${LEFT_MARKER} ${df.fromState} ${df.fromSymbol} ${a} ${RIGHT_MARKER}]`;
        (grammar[from] = grammar[from] || []).push(`[${df.toState} ${LEFT_MARKER} ${df.toSymbol} ${a} ${RIGHT_MARKER}]`);
        from = `[${LEFT_MARKER} ${df.fromState} ${df.fromSymbol} ${a}]`;
        (grammar[from] = grammar[from] || []).push(`[${df.toState} ${LEFT_MARKER} ${df.toSymbol} ${a}]`);

        tm.tapeSymbols.forEach((Z) => {
          tm.inputSymbols.forEach((b) => {
            let from2 = `[${Z} ${b}][${df.fromState} ${df.fromSymbol} ${a}]`;
            (grammar[from2] = grammar[from2] || []).push(`[${df.toState} ${Z} ${b}][${df.toSymbol} ${a}]`);
            from2 = `[${LEFT_MARKER} ${Z} ${b}][${df.fromState} ${df.fromSymbol} ${a}]`;
            (grammar[from2] = grammar[from2] || []).push(`[${LEFT_MARKER} ${df.toState} ${Z} ${b}][${df.toSymbol} ${a}]`);
            from2 = `[${Z} ${b}][${df.fromState} ${df.fromSymbol} ${a} ${RIGHT_MARKER}]`;
            (grammar[from2] = grammar[from2] || []).push(`[${df.toState} ${Z} ${b}][${df.toSymbol} ${a} ${RIGHT_MARKER}]`);
          });
        });
      } else {
        let from = `[${LEFT_MARKER} ${df.fromState} ${df.fromSymbol} ${a} ${RIGHT_MARKER}]`;
        (grammar[from] = grammar[from] || []).push(`[${LEFT_MARKER} ${df.toSymbol} ${a} ${df.toState} ${RIGHT_MARKER}]`);

        tm.tapeSymbols.forEach((Z) => {
          tm.inputSymbols.forEach((b) => {
            let from2 = `[${LEFT_MARKER} ${df.fromState} ${df.fromSymbol} ${a}][${Z} ${b}]`;
            (grammar[from2] = grammar[from2] || []).push(`[${LEFT_MARKER} ${df.toSymbol} ${a}][${df.toState} ${Z} ${b}]`);
            from2 = `[${df.fromState} ${df.fromSymbol} ${a}][${Z} ${b}]`;
            (grammar[from2] = grammar[from2] || []).push(`[${df.toSymbol} ${a}][${df.toState} ${Z} ${b}]`);
            from2 = `[${df.fromState} ${df.fromSymbol} ${a}][${Z} ${b} ${RIGHT_MARKER}]`;
            (grammar[from2] = grammar[from2] || []).push(`[${df.toSymbol} ${a}][${df.toState} ${Z} ${b} ${RIGHT_MARKER}]`);
          });
        });

        from = `[${df.fromState} ${df.fromSymbol} ${a} ${RIGHT_MARKER}]`;
        (grammar[from] = grammar[from] || []).push(`[${df.toSymbol} ${a} ${df.toState} ${RIGHT_MARKER}]`);
      }
    });
  });

  const finalStates = [tm.acceptState];
  finalStates.forEach((q) => {
    tm.tapeSymbols.forEach((X) => {
      tm.inputSymbols.forEach((a) => {
        [
          `[${q} ${LEFT_MARKER} ${X} ${a} ${RIGHT_MARKER}]`,
          `[${LEFT_MARKER} ${q} ${X} ${a} ${RIGHT_MARKER}]`,
          `[${LEFT_MARKER} ${X} ${a} ${q} ${RIGHT_MARKER}]`,
          `[${q} ${LEFT_MARKER} ${X} ${a}]`,
          `[${LEFT_MARKER} ${q} ${X} ${a}]`,
          `[${q} ${X} ${a}]`,
          `[${q} ${X} ${a} ${RIGHT_MARKER}]`,
          `[${X} ${a} ${q} ${RIGHT_MARKER}]`,
        ].forEach((val) => {
          (grammar[val] = grammar[val] || []).push(`${a}`);
        });

        tm.inputSymbols.forEach((b) => {
          [
            `${a}[${X} ${b}]`,
            `${a}[${X} ${b} ${RIGHT_MARKER}]`,
            `[${X} ${a}]${b}`,
            `[${LEFT_MARKER} ${X} ${a}]${b}`,
          ].forEach((val) => {
            (grammar[val] = grammar[val] || []).push(`${a}${b}`);
          });
        });
      });
    });
  });

  tm.inputSymbols.forEach((a) => {
    grammar.A1.push(`[${LEFT_MARKER} ${tm.startState} ${a} ${a}]A2`);
    if (!grammar.A2) {
      grammar.A2 = [];
    }
    grammar.A2.push(`[${a} ${a}]A2`, `[${a} ${a} ${RIGHT_MARKER}]`);
  });

  helpers.writeGrammar('grammar1.txt', grammar, () => {
    console.log('Done!');
  });
} catch (e) {
  console.log(e);
}
