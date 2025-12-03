const fs = require("fs");
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day3.txt";

function maxWithNaN(a, b) {
    if (isNaN(a) && isNaN(b)) return NaN;   // both are NaN
    if (isNaN(a)) return b;                 // only a is NaN
    if (isNaN(b)) return a;                 // only b is NaN
    return Math.max(a, b);                  // both are numbers
}

class Bank {
    constructor(line) {
        this.numbers = line.split('').map(ch => parseInt(ch, 10));
    }

    partOne() {
        let max_found = this.numbers[0] * 10 + this.numbers[1];
        let max_left = Math.max(this.numbers[0], this.numbers[1]);

        for (let i = 2; i < this.numbers.length; i++) {
          let new_value = max_left * 10 + this.numbers[i];
          max_found = Math.max(max_found, new_value);
          max_left = Math.max(max_left, this.numbers[i]);
        }

        return max_found;
    }    

    partTwo() {
        const length = 12;
        let cache = new Array(length).fill(NaN);
        cache[0] = this.numbers[0];  

        for (let i = 1; i < this.numbers.length; i++) {
          let num = this.numbers[i];
          let new_cache = new Array(length).fill(NaN);
          new_cache[0] = Math.max(cache[0], num);

          for(let j = 0; j < length - 1; j++){
            if (!isNaN(cache[j]))
              new_cache[j+1] = maxWithNaN(cache[j+1], cache[j] * 10 + num);
          }

          for (let j = 0; j < length; j++)
            cache[j] = new_cache[j];
        }

        return cache[length - 1];
    }     
}

function loadBanksFromFile(filename = 'input.txt') {
    const content = fs.readFileSync(filename, 'utf8');

    // split lines, filter out empty ones
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

    // convert each line into a Bank
    return lines.map(line => new Bank(line));
}

const banks = loadBanksFromFile(filename);


let totalPartOne = 0;
for (const bank of banks) {
  totalPartOne += bank.partOne();
}
console.log('Part one = ' + totalPartOne);


let totalPartTwo = 0;
for (const bank of banks) {
  totalPartTwo += bank.partTwo();
}
console.log('Part one = ' + totalPartTwo);
