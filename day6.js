const fs = require("fs");
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day6.txt";

// Define a class called Question that has operation type (string) eiether + or *
// and a list of integers that the operation will be applied to
class Question {
    constructor(operation, numbers) {
        this.operation = operation;
        this.numbers = numbers;
    }

    result(){
        if (this.operation === "+") {
            return this.numbers.reduce((a, b) => a + b, 0);
        } else if (this.operation === "*") {
            return this.numbers.reduce((a, b) => a * b, 1);
        } else {
            throw new Error(`Unknown operation: ${this.operation}`);
        }
    }
}


// Function to read file filename and read 5 lines and trim each line, items in each line are space separated
// Then transpose the lines and return the transposed lines as array of arrays
// Each line can have multiple spaces between items
function readAndTranspose(filename) {
    const content = fs.readFileSync(filename, 'utf8');

    // split lines, filter out empty ones
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

    // Read 5 lines at a time
    const chunkedLines = [];
    for (let i = 0; i < lines.length; i += 5) {
        const chunk = lines.slice(i, i + 5).map(line => line.trim().split(/\s+/));
        chunkedLines.push(chunk);
    }

    // Transpose each chunk and collect results
    const transposedResults = [];
    for (const chunk of chunkedLines) {
        const transposed = [];
        for (let col = 0; col < chunk[0].length; col++) {
            const newRow = [];
            for (let row = 0; row < chunk.length; row++) {
                newRow.push(chunk[row][col]);
            }
            transposed.push(newRow);
        }
        transposedResults.push(transposed);
    }

    return transposedResults;
}

const transposedLines = readAndTranspose(filename);

const questions = [];
// for each transposed line, create a Question object
// For each line, last item is the operand, the rest are numbers
for (const transposed of transposedLines) {
    for (const items of transposed) {
        const numbers = items.slice(0, -1).map(numStr => parseInt(numStr, 10));
        const operation = items[items.length - 1];
        const question = new Question(operation, numbers);
        questions.push(question);
    }
}

// Compute the sum of result of all questions
let partOneSum = 0;
for (const question of questions) {
    partOneSum += question.result();
}

console.log(`Part One: Sum of all question results is ${partOneSum}`);

