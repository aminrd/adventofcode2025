import fs from 'fs';
import solver from 'javascript-lp-solver';
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day10.txt";

function array_to_key(arr) {
    return arr.join(",");
}

// Check if two array are equal
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

function copy_array(array){
    let new_array = new Array(array.length).fill(0);
    for(let i = 0; i < array.length; i++)
        new_array[i] = array[i];
    return new_array;
}

function apply_button_to_state(button, state, nums){
    let new_state = copy_array(state);

    for (let j=0; j<button.length; j++){
        let button_index = button[j];
        new_state[button_index] += nums;
    }

    return new_state;
}

function is_target_smaller(target, state){
    for(let j = 0; j < target.length; j++){
        if(target[j] < state[j])
            return true;
    }
    return false;
}

function lower_bound(target, state){
    let bound = 0;
    for(let j = 0; j < target.length; j++){
        let diff = Math.abs(target[j] - state[j]);
        bound = Math.max(bound, diff);
    }    
    return bound;
}
console.assert(
    lower_bound([1,2,3], [2,10,6]) === 8
);

function min_diff(button, state, target){
    let diff = Infinity;
    for (let j=0; j<button.length; j++){
        let button_index = button[j];
        diff = Math.min(diff, target[button_index] - state[button_index]);
    }
    return diff;
}
console.assert(
    min_diff([1,3], [0,1,0,0,0], [5,5,5,5,5]) === 4
);

// Check if apply_button_to_array is working fine
console.assert(
    arraysEqual(
        apply_button_to_state([0,2], [0,0,0,0,0], 1),
        [1,0,1,0,0]
    )
);


// Check if state to key is working fine
console.assert(
    array_to_key([1,2,3]) === "1,2,3"
);

function make2D(rows, cols) {
    return Array.from({length: rows}, () => Array(cols).fill(0));
}

const createRangeArray = (start, end) => {
  if (start > end) {
    // Handle cases where start is greater than end, e.g., return an empty array or throw an error.
    return []; 
  }
  const length = end - start + 1;
  return Array.from({ length: length }, (_, index) => start + index);
};


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

    part_two_linear_programmign(){
        let buttons = this.buttons;
        let joltage = this.joltage;

        // Create the constraints
        let constraints = {};
        for (let i = 0; i < joltage.length; i++) {
            let constraint = {};
            for (let j = 0; j < buttons.length; j++) {
                constraint['x' + j] = buttons[j].includes(i) ? 1 : 0;
            }
            constraints['c' + i] = { equal: joltage[i], ...constraint };
        }

        // Define integer variables
        let ints = {};
        for (let j = 0; j < buttons.length; j++) {
            ints['x' + j] = 1;
        }

        // Objective: minimize sum of buttons
        let model = {
            optimize: "total",
            opType: "min",
            constraints: {},
            variables: {},
            ints: {}
        };

        // Build variables and constraints
        for (let j = 0; j < buttons.length; j++) {
            let varObj = { total: 1 }; // coefficient in objective
            for (let i = 0; i < joltage.length; i++) {
                varObj['c' + i] = buttons[j].includes(i) ? 1 : 0;
            }
            model.variables['x' + j] = varObj;
            model.ints['x' + j] = 1;
        }

        // Add constraints for each joltage
        for (let i = 0; i < joltage.length; i++) {
            model.constraints['c' + i] = { equal: joltage[i] };
        }

        // Solve
        let solution = solver.Solve(model);
        return solution.result;
    }

    part_two_dfs(){
        const target = this.joltage;
        const n = target.length;
        const length = this.joltage.length;
        const start = new Array(length).fill(0);

        let mat = make2D(n, this.buttons.length);
        for(let i = 0; i < this.buttons.length; i++){
            let button = this.buttons[i];
            for(let j = 0; j < button.length; j++){
                mat[button[j]][i] = 1;
            }
        }

        // Sort buttons descending by size
        this.buttons.sort((a, b) => b.length - a.length);
        let result = Infinity;        

        let max_possible = Math.max(...target);
        console.log(max_possible);
         
        function dfs(state, dist, buttons, b_index)
        {
            if(arraysEqual(state, target)){
                result = Math.min(result, dist);
                return;
            }

            if (dist > max_possible)
                return;

            if(b_index >= buttons.length){
                return;
            }
            
            if((dist + lower_bound(target, state)) >= result){
                return;
            }

            const button = buttons[b_index];
            const button_diff = min_diff(button, state, target);

            if (button_diff < 0){
                console.log("Warning : possible mistake here when button_diff is negative!");
                return;
            }

            // Try 0 times of this button first
            dfs(state, dist, buttons, b_index + 1);

            if(button_diff === 0)
                return;

            const initial_sate = copy_array(state);
            let new_state = apply_button_to_state(button, initial_sate, button_diff);
            dfs(new_state, dist + button_diff, buttons, b_index+1);

            let steps = createRangeArray(1, button_diff - 1);

            while(steps.length > 0){
                const randomIndex = Math.floor(Math.random() * steps.length);
                const step = steps.splice(randomIndex, 1)[0];              
                new_state = apply_button_to_state(button, initial_sate, step);
                dfs(new_state, dist + step, buttons, b_index+1);                                
            }
        }

        while(max_possible < 500 && result === Infinity){
            dfs(start, 0, this.buttons, 0);
            max_possible += 50;
            console.log('Increasing maximum possible distance to ' + max_possible)            
        }
        return result;        
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


let partTwo = 0;
for (let i = 0 ; i < machines.length; i++){
    let matchine_result =  machines[i].part_two_linear_programmign()
    console.log("Finished " + i + " machine out of " + machines.length + " current result = " + matchine_result);

    partTwo += matchine_result;
}
console.log("Part two = " + partTwo);