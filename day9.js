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