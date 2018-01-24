# Grammar_analyze

- Some algorithms for FL course SPBU:

  - matrix.js
  - bottomup.js
  - topdown.js

## Requirements

- NodeJS

## Input format

```matrix.js``` - Grammar in Homsky normal form

```bottomup.js`` - Grammar in RFA form

```topdown.js``` - Grammar in RFA form

### How to run

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

   - Approximate time ~2.5 minutes for all tests

- To test all algorithms with SMALL tests:

  ```node tests.js small```
