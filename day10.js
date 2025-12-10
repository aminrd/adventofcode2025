const fs = require("fs");
const { get } = require("http");
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day10.txt";


class Machine {
    constructor(pattern, buttons, joltage) {
        this.pattern = pattern;
        this.buttons = buttons;
        this.joltage = joltage;
        this.patter_length = this.pattern.length;
    }

    patternMask() {
        return [...this.pattern].reduce(
            (mask, ch, i) => mask | ((ch === "#" ? 1 : 0) << i),
            0
        );
    }

    buttonMasks() {
        const n = this.pattern.length;
        return this.buttons.map(indices => {
            let mask = 0;
            for (const idx of indices) {
                if (idx >= 0 && idx < n) {
                    mask |= (1 << idx);
                }
            }
            return mask;
        });
    }    

    part_one_bfs() {
        const target = this.patternMask();
        const buttonMasks = this.buttonMasks();

        const start = 0;  // all lights off
        if (start === target) return 0;

        const queue = [];
        const visited = new Set();
        queue.push([start, 0]);
        visited.add(start);

        while (queue.length > 0) {
            const [state, dist] = queue.shift();
            for (const bMask of buttonMasks) {
                const nextState = state ^ bMask;

                if (nextState === target) {
                    return dist + 1;
                }

                if (!visited.has(nextState)) {
                    visited.add(nextState);
                    queue.push([nextState, dist + 1]);
                }
            }
        }
        return -1;
    }
}

function loadMachines(filename) {
    const lines = fs.readFileSync(filename, "utf8")
        .trim()
        .split(/\r?\n/);

    const machines = [];

    for (const line of lines) {
        if (!line.trim()) 
            continue;

        const patternMatch = line.match(/\[([.#]+)\]/);
        if (!patternMatch) continue;
        const pattern = patternMatch[1];

        // Extract all button groups inside (...)
        const buttonMatches = [...line.matchAll(/\((.*?)\)/g)];
        const buttons = buttonMatches.map(match => {
            const inner = match[1].trim();
            if (inner.length === 0) 
                return [];
            return inner.split(",").map(n => parseInt(n.trim(), 10));
        });

        const joltageMatch = line.match(/\{([^}]*)\}/);
        let joltage = [];
        if (joltageMatch) {
            joltage = joltageMatch[1]
                .split(",")
                .map(v => parseInt(v.trim(), 10));
        }

        machines.push(new Machine(pattern, buttons, joltage));
    }

    return machines;
}


const machines = loadMachines(filename);

let partOne = 0;
for (let i = 0 ; i < machines.length; i++){
    partOne += machines[i].part_one_bfs()
}
console.log("Part one = " + partOne);