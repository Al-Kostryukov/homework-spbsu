const { EPS } = require('./constants');

const removeEpsSymbol = str => str.replace(new RegExp(`${EPS}`, 'g'), '');

module.exports = (grammar, n = +process.env.PRIMES_COUNT || 10, lengthLimit = 200) => {
  console.log('Generating primes:');
  const generations = ['A1'];
  const primes = new Set();
  const grammarLeft = Object.keys(grammar);
  const acceptRegexp = new RegExp(`^[1${EPS}]+$`);

  while (generations.length > 0 && primes.size <= n) {
    const gen = generations.shift();

    grammarLeft.forEach((left) => {
      if (gen.indexOf(left) > -1) {
        grammar[left].forEach((right) => {
          const nextGen = gen.replace(left, right);
          if (acceptRegexp.test(nextGen)) {
            const nextGenNoEps = removeEpsSymbol(nextGen);
            const decimal = nextGenNoEps.length;
            if (!primes.has(decimal)) {
              primes.add(decimal);
              console.log('New prime generated:', decimal, ':', nextGenNoEps);
            }

            return;
          }

          if (nextGen.length < lengthLimit && generations.indexOf(nextGen) < 0) {
            generations.push(nextGen);
          }
        });
      }
    });
  }
};
