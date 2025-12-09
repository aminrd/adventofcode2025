const fs = require("fs");
const { get } = require("http");
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day9.txt";


// read 2d coordinates from file and return a list of [x, y] pairs, each line is "x,y,\n"
function loadCoordinatesFromFile(filename = 'input.txt') {
    const content = fs.readFileSync(filename, 'utf8');

    // split lines, filter out empty ones
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

    // convert each line into a [x, y] pair
    const coordinates = lines.map(line => {
        const [xStr, yStr] = line.split(',').map(s => s.trim());
        return [parseInt(xStr, 10), parseInt(yStr, 10)];
    });

    return coordinates;
}

const points = loadCoordinatesFromFile(filename);


// Compute the area of rectable given two diagonal points
function rectangleArea(p1, p2) {
    const width = Math.abs(p2[0] - p1[0]) + 1;
    const height = Math.abs(p2[1] - p1[1]) + 1;
    return width * height;
}


// find maximum possible area rectangle given a list of points
function findMaxRectangleArea(points) {
    let maxArea = 0;

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const area = rectangleArea(points[i], points[j]);
            if (area > maxArea) {
                maxArea = area;
            }
        }
    }

    return maxArea;
}

const partOneResult = findMaxRectangleArea(points);
console.log("Part One:", partOneResult);

// Get the min and max X and Y to determine grid size
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
}

const gridWidth = maxX - minX + 1;
const gridHeight = maxY - minY + 1;

// Helper function check if a point resides on the boundary of the rectangle
function isOnBoundary(px, py, left, right, bottom, top) {
    return (
        ((px === left || px === right) && (py >= top && py <= bottom)) ||
        ((py === top || py === bottom) && (px >= left && px <= right))
    );
}

function isInside(px, py, left, right, bottom, top) {
    return (
        px > left &&
        px < right &&
        py > top &&
        py < bottom
    );
}

// helper funcitoon compute dx, dy directions between two points to reach from p1 to p2
function computeDirection(p1, p2) {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    return [Math.sign(dx), Math.sign(dy)];
}

function get_point_key(x, y){
    return `${x},${y}`;
}

function perimeter_size(x1, y1, x2, y2){
    let y_size = Math.abs(y1 - y2) + 1;
    let x_size = Math.abs(x1 - x2) + 1;

    if (x1 == x2)
        return y_size;
    if (y1 == y2)
        return x_size;

    return 2 * y_size + 2 *x_size- 4;
}

function same_points(x1, y1, x2, y2){
    return x1 === x2 && y1 === y2;
}

function can_move(x0, y0, x1, y1, x2, y2){
    if (same_points(x0, y0, x2, y2))
        return false;
    if (y1 === y2)
        return (x1 <= x0 && x0 <= x2) || (x2 <= x0 && x0 <= x1);
    if (x1 === x2)
        return (y1 <= y0 && y0 <= y2) || (y2 <= y0 && y0 <= y1);
    return false;
}

// Returns true if all of the points inside the rectable, are also inside the whole hull
function CoverInsidePoints(i, j){    
    // get x, y coordinates of these points
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];    

    const left   = Math.min(xi, xj);
    const right  = Math.max(xi, xj);
    const top    = Math.min(yi, yj);
    const bottom = Math.max(yi, yj);    

    if ((i + 1) === j)
        return true;

    // create a set of visited points
    const visited = new Set();

    visited.add(get_point_key(xi, yi));
    visited.add(get_point_key(xj, yj));

    const numberOfPoints = points.length;
    let [x, y] = points[i];
    let p_size = perimeter_size(xi, yi, xj, yj)  

    for (let k = 0; k < numberOfPoints; k++){        
        let [x_start, y_start] = points[(i + k) % numberOfPoints];
        let [x_end, y_end] = points[(i + k + 1) % numberOfPoints];

        if (!can_move(x, y, x_start, y_start, x_end, y_end))
            continue;

        let [dx, dy] = computeDirection([x_start, y_start], [x_end, y_end]);
        let line_length = Math.abs(y_end - y_start) + Math.abs(x_end - x_start);

        for (let l=0; l < line_length; l++){
            x_start += dx;
            y_start += dy;

            if (isInside(x_start, y_start, left, right, bottom, top))
                return false;

            let nx = x+dx;
            let ny = y+dy;

            if (isOnBoundary(nx, ny, left, right, bottom, top)){
                visited.add(get_point_key(nx, ny));
                x = nx;
                y = ny;
            }else{
                break;
            }            
        }

        if (visited.size === p_size)
            break;
    }
    
    return visited.size === p_size;
}


let maxAreaPartTwo = 0;

var total = (points.length * (points.length - 1)) / 2;

for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
        total -= 1;
        if (total % 10000 === 0)
            console.log("remaining : " + total);

        const area = rectangleArea(points[i], points[j]);
        if (area <= maxAreaPartTwo)
            continue;

        if(CoverInsidePoints(i, j) && area > maxAreaPartTwo){          
            maxAreaPartTwo = area;
        }
    }
}

console.log("Part Two:", maxAreaPartTwo);