const fs = require("fs");
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day4.txt";

// The grid is either . or @
function loadGrid(filename) {
  const raw = fs.readFileSync(filename, 'utf8')
    .split('\n')         // split into lines
    .map(line => line.split('')); // split each line into chars

  return raw; // 2D array
}

// Example usage:
const grid = loadGrid(filename);
const m = grid.length;
const n = grid[0].length;

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0], [1, 1]
];

// Check 8 neighbors and return true if at least 4 is not @
function isAccessible(x, y){
  if (grid[x][y] === '.')
    return false;

  let count = 0;
  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
      if (grid[nx][ny] === '@')
        count++;
    }
  }

  return count < 4;
}

let partOne = 0;
let queue = [];

// loop over all cells and count accessible ones
for (let i = 0; i < m; i++) {
  for (let j = 0; j < n; j++) {
    if (isAccessible(i, j)) {      
      partOne++;
      queue.push([i, j]);
    }
  }
}

console.log("Part One:", partOne);


let partTwo = 0;

while (queue.length > 0){
  const [x, y] = queue.shift();

  if (grid[x][y] === '.')
    continue;

  if (isAccessible(x, y)){
    partTwo++;
    grid[x][y] = '.'; // mark as visited

    // Add neighbors to the queue
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === '@') {
        queue.push([nx, ny]);
      }
    }
  }
}

console.log("Part Two:", partTwo);