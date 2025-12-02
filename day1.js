const fs = require("fs");

// A simple class representing one rotation instruction
class Rotation {
    constructor(direction, steps) {
        this.direction = direction; // "L" or "R"
        this.steps = steps;         // number
    }
}

function parseInputFile(filename) {
    const raw = fs.readFileSync(filename, "utf8").trim();
    const lines = raw.split(/\r?\n/);

    const rotations = lines.map(line => {
        // First character is L or R
        const direction = line[0];
        // Remaining substring is steps, convert to integer
        const steps = parseInt(line.slice(1), 10);

        return new Rotation(direction, steps);
    });

    return rotations;
}

// Example usage:
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed

let filename = debug ? "test.txt" : "day1.txt";
const rotations = parseInputFile(filename);

function applyRotation(position, rotation) {
    const { direction, steps } = rotation;

    if (direction === "L") {
        // Move toward lower numbers, wrapping around 0 → 99
        return (position - (steps % 100) + 100) % 100;
    } else if (direction === "R") {
        // Move toward higher numbers, wrapping around 99 → 0
        return (position + steps) % 100;
    } else {
        throw new Error("Invalid rotation direction: " + direction);
    }
}

let zero_counter = 0;
let pos = 50;
for(let i=0; i < rotations.length; i++){
    pos = applyRotation(pos, rotations[i]);
    if (pos == 0)
        zero_counter++;
}
console.log("Total zero counter = " + zero_counter);


function applyZeroCounts(position, rotation) {
    const { direction, steps } = rotation;
    const fullRotations = Math.floor(steps / 100);
    let zerosSeen = fullRotations;
    let newPosition = applyRotation(position, rotation);

    if (position == 0)
        return { newPosition, zerosSeen };

    if (newPosition == 0)
        zerosSeen++;
    else if (position != 0 && direction == 'R' && newPosition < position)
        zerosSeen ++;
    else if(position != 0 && direction == 'L' && newPosition > position)
        zerosSeen ++;
        
    return { newPosition, zerosSeen };
}

function tests() {
    console.log("Running tests...");

    const testCases = [
        { pos: 0, rot: new Rotation("R", 100), expected: { newPosition: 0, zerosSeen: 1 } },
        { pos: 50, rot: new Rotation("R", 48), expected: { newPosition: 98, zerosSeen: 0 } },
        { pos: 50, rot: new Rotation("R", 60), expected: { newPosition: 10, zerosSeen: 1 } },
        { pos: 50, rot: new Rotation("L", 55), expected: { newPosition: 95, zerosSeen: 1 } },
        { pos: 50, rot: new Rotation("L", 68), expected: { newPosition: 82, zerosSeen: 1 } },
        { pos: 0, rot: new Rotation("L", 250), expected: { newPosition: 50, zerosSeen: 2 } },
    ];

    let allPassed = true;

    for (const { pos, rot, expected } of testCases) {
        const result = applyZeroCounts(pos, rot);
        const passed = result.newPosition === expected.newPosition && result.zerosSeen === expected.zerosSeen;
        if (!passed) {
            allPassed = false;
            console.error(`FAIL: pos=${pos}, rot=${rot.direction}${rot.steps} → expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
        } else {
            console.log(`PASS: pos=${pos}, rot=${rot.direction}${rot.steps}`);
        }
    }

    if (allPassed) console.log("All tests passed!");
    else console.error("Some tests failed!");
}

if (debug) tests()


let zero_pass = 0;
let current_position = 50;
for(let i=0; i < rotations.length; i++){
    result = applyZeroCounts(current_position, rotations[i]);
    zero_pass += result.zerosSeen;
    current_position = result.newPosition;
}
console.log("Total zero seen = " + zero_pass);