# Структура репозитория
* Директория src/
    * **utm1.txt описание LBA в унарной с.с.**
    * **unaryTuringMachineToGrammarType0.js - программа-конвертер LBA в унарной с.с. в грамматику T0**
    * turingMachineToGrammarType1.js - программа-конвертер LBA в двоичной с.с. в грамматику T1
    * turingMachineToGrammarType0.js - программа-конвертер LBA в двоичной с.с. в грамматику T0
	* tm1.txt, tm0.txt - описания LBA в двоичной с.с.
* Директория examples/
    * generation1.txt - вывод простого числа 1011 в двоичной с.с. в грамматике T1 
    * generation0.txt - вывод простого числа 1011 в двоичной с.с. в грамматике T0
# Установка среды исполнения Node.js для OC Windows (необходима версия > 8.0.0)
1. Скачайте msi пакет, доступен на официальном сайте: https://nodejs.org/en/download/
2. Установите (Далее -> ... -> Далее -> Готово)
# Как запустить **для унарной с.с.**
1. Скачайте архив (https://github.com/Al-Kostryukov/homework-spbsu/archive/turing-to-grammar.zip) и разархивируйте (или склонируйте репозиторий и перейдите в ветку turing-to-grammar)
2. Найдите (через пуск или как-нибудь иначе) и запустите "node js command prompt" 
3. В открывшемся командном интерфейсе с помощью команд `cd` доберитесь до директории src/ скачанного репозитория
4. Выполните: `node unaryTuringMachineToGrammarType0.js` для генерации грамматики T0.
5. Дождитесь вывода строчки "Writing to ugrammar0.txt done!" - в файле ugrammar0.txt будет лежать сгенерированная грамматика T0.
6. Затем автоматически запустится вывод простых чисел:
```
Generating primes:
New prime generated: 2 : 11
New prime generated: 3 : 111
New prime generated: 5 : 11111
New prime generated: 7 : 1111111
...
```
# Как запустить **для двоичной с.с. - нет вывода простых чисел**
1. Скачайте архив (https://github.com/Al-Kostryukov/homework-spbsu/archive/turing-to-grammar.zip) и разархивируйте (или склонируйте репозиторий и перейдите в ветку turing-to-grammar)
2. Найдите (через пуск или как-нибудь иначе) и запустите "node js command prompt" 
3. В открывшемся командном интерфейсе с помощью команд `cd` доберитесь до директории src/ скачанного репозитория
4. Выполните: `node turingMachineToGrammarType1.js` или `node turingMachineToGrammarType0.js` для генерации грамматики нужного типа
5. Дождитесь вывода строчки "Done!"
6. Результат будет лежать в файлах grammar1.txt или grammar0.txt 


