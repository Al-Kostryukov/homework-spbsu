# Grammar analyzer

- Some algorithms for FL course SPBU:

  - matrix.js
  - bottomup.js
  - topdown.js

## Requirements

- Node.js v7+ (tested on v7.9.4)

  How to install:
  - From official website:
    - Go to nodejs.org
    - Download Latest
  - Using your package manager
    - for Ubuntu (but check version before installation, we need Node.js v7+)
      - sudo apt-get install nodejs
  - Using n (https://github.com/tj/n) - the most beautiful thing
    - n latest


## Input formats

```matrix.js``` - Grammar in Homsky normal form

```bottomup.js``` - Grammar in RFA form

```topdown.js``` - Grammar in RFA form

### How to run
### ! Attention: Nodejs Executable may be called ```node``` or ```nodejs``` depending on your installation way. Further we use ```node```, but you may use ```nodejs```  

- Matrix:
  ```
  node analyze.js m <grammar file> <graph file> <output file (optional)>
  ```

  Example:
  ```
  node analyze.js m tests/grammars/homsky/Q1-homsky.txt tests/graphs/skos.dot output.txt
  ```

- Bottomup:
   ```
   node analyze.js b <grammar file> <graph file> <output file (optional)>
   ```

   Example:
   ```
   node analyze.js b tests/grammars/rfa/Q1-rfa.txt tests/graphs/skos.dot output.txt
   ```

- Topdown:
   ```
   node analyze.js t <grammar file> <graph file> <output file (optional)>
   ```

   Example:
   ```
   node analyze.js t tests/grammars/rfa/Q1-rfa.txt tests/graphs/skos.dot output.txt
   ```

### Test

- To test specific algorithm:

  -  Matrix: ```node tests.js m```

  -  Bottomup: ```node tests.js b```

  -  Topdown: ```node tests.js t```

- To test all algorithms with ALL tests:

  ```node tests.js all```

   - Approximate time ~4.5 minutes for all (99 big + 60 small) tests on Node.js v7.9.4
   - Approximate time ~3 minute for all (99 big + 60 small) tests on Node.js v9.4.0

- To test all algorithms with SMALL tests:

  ```node tests.js small```
`
