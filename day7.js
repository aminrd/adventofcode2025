const fs = require("fs");
const { get } = require("http");
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day7.txt";


// Read filename, and read a 2d grid of characters triming each line and droping /n
function loadGridFromFile(filename = 'input.txt') {
    const content = fs.readFileSync(filename, 'utf8');

    // split lines, filter out empty ones
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

    // convert each line into an array of characters
    const grid = lines.map(line => line.split(''));

    return grid;
}

// grid is filled with . or ^
const grid = loadGridFromFile(filename);
const m = grid.length;
const n = grid[0].length;

// find index of character S from first line
const s_index = grid[0].indexOf('S');

// helper print a 2d array for merging characters in each line
function print_2d_array(arr) {
    for (let i = 0; i < arr.length; i++) {
        // if isNaN use '.' else use the number
        for (let j = 0; j < arr[i].length; j++) {
            if (Number.isNaN(arr[i][j])) {
                arr[i][j] = '.';
            }
        }
        console.log(arr[i].join(''));
    }
}

function find_total_number_of_splits(grid, m, n, s_index) {
    // create a new beam indicator with empty grid of size m x n filled with NaN
    let beam_indicator = new Array(m);
    for (let i = 0; i < m; i++) {
        beam_indicator[i] = new Array(n).fill(NaN);
    }
    
    // set first row at s_index to 1
    let max_beam = 0;
    let split_count = 0;

    const queue = [];
    queue.push([0, s_index]);

    function isValid(i, j){
        return i >= 0 && i < m && j >= 0 && j < n && Number.isNaN(beam_indicator[i][j]);
    }
    
    while (queue.length > 0) {
        // pop first element from queue
        let [x, y] = queue.shift();

        if (!Number.isNaN(beam_indicator[x][y]))
            continue;

        max_beam++;
        beam_indicator[x][y] = max_beam;

        x++; 
        while (x < m && Number.isNaN(beam_indicator[x][y]) && x < m && grid[x][y] === '.') {
            beam_indicator[x][y] = beam_indicator[x - 1][y];
            x++;
        }

        if (x < m && grid[x][y] === '^') {
            split_count++;
            // split beam
            const left_y = y - 1;
            const right_y = y + 1;

            if (isValid(x, left_y)) {
                queue.push([x, left_y]);
            }

            if (isValid(x, right_y)) {
                queue.push([x, right_y]);
            }
        }
    }

    if (debug)
        print_2d_array(beam_indicator);

    return split_count;
}

const partOneResult = find_total_number_of_splits(grid, m, n, s_index);
console.log("Part One:", partOneResult);




function find_total_number_of_pathways(grid, m, n, s_index) {
    let board = new Array(m);
    for (let i = 0; i < m; i++) {
        board[i] = new Array(n).fill(0);
    }

    board[0][s_index] = 1;

    const queue = [];

    function isValid(i, j){
        return i >= 0 && i < m && j >= 0 && j < n ;
    }

    for (let i = 1; i < m - 1; i++) {
        for (let j = 0; j < n; j++){
            if (grid[i][j] === '^'){
                board[i][j-1] += board[i - 1][j];
                board[i][j+1] += board[i - 1][j];
            }
            else{
                board[i][j] += board[i - 1][j];
            }
        }
    }


    if (debug)
        print_2d_array(board);

    // sum of the last row

    let total_paths = 0;
    for (let j = 0; j < n; j++){
        total_paths += board[m - 2][j];
    }

    return total_paths; 
}

const partTwoResult = find_total_number_of_pathways(grid, m, n, s_index);
console.log("Part Two:", partTwoResult);