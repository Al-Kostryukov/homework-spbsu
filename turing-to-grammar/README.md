# Структура репозитория
* Директория src/
    * turingMachineToGrammarType1.js - программа-конвертер LBA в грамматику T1
    * turingMachineToGrammarType0.js - программа-конвертер LBA в грамматику T0
	* tm1.txt, tm0.txt - описания LBA 
* Директория examples/
    * generation1.txt - вывод простого числа 1011 в грамматике T1
    * generation0.txt - вывод простого числа 1011 в грамматике T0
# Установка среды исполнения Node.js для OC Windows (необходима версия > 8.0.0)
1. Скачайте msi пакет, доступен на официальном сайте: https://nodejs.org/en/download/
2. Установите (Далее -> ... -> Далее -> Готово)
# Как запустить 
1. Скачайте архив (https://github.com/Al-Kostryukov/homework-spbsu/archive/turing-to-grammar.zip) и разархивируйте (или склонируйте репозиторий и перейдите в ветку turing-to-grammar)
2. Найдите (через пуск или как-нибудь иначе) и запустите "node js command prompt" 
3. В открывшемся командном интерфейсе с помощью команд `cd` доберитесь до директории src/ скачанного репозитория
4. Выполните: `node turingMachineToGrammarType1.js` или `node turingMachineToGrammarType0.js` для генерации грамматики нужного типа
5. Дождитесь вывода строчки "Done!"
6. Результат будет лежать в файлах grammar1.txt или grammar0.txt 




