const { group } = require("console");
const fs = require("fs");
const { get } = require("http");
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day8.txt";


function loadCoordinates(filename) {
    const text = fs.readFileSync(filename, "utf8").trim();
    return text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.split(",").map(Number)); // [x, y, z]
}

// helper a funciton that calculates the Euclidean distance between two 3D points
function euclideanDistance(point1, point2) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    const dz = point1[2] - point2[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

const coordinates = loadCoordinates(filename);



// Maximum number of operations possible to connect two points
function find_cluster_sizes(coords, k){
    const n = coords.length;
    
    // Initialize a groud ip for each point from 1 to n
    const gropu_id = new Array(n);
    for (let i = 0; i < n; i++)
        gropu_id[i] = i;

    // A list of gropu sizez initailize 1 for each group
    const group_size = new Array(n).fill(1);

    // compute all pairwise distances
    const distances = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const dist = euclideanDistance(coords[i], coords[j]);
            distances.push({dist, i, j});
        }
    }

    // define a function to connect two points togetehr
    function connect(i, j){
        if (gropu_id[i] === gropu_id[j])
            return; // already connected

        const group_i = gropu_id[i];
        const group_j = gropu_id[j];

        // merge all points in group_j to group_i
        for (let p = 0; p < n; p++){
            if (gropu_id[p] === group_j){
                gropu_id[p] = group_i;
                group_size[group_i] += 1;
                group_size[group_j] -= 1;
            }
        }
    }

    // sort distances in ascending order ( by first element in tuple)
    distances.sort((a, b) => a.dist - b.dist);

    for (let operation = 0; operation < k; operation++){
        // pop first element from distances
        if (distances.length === 0) break;
        const {dist, i, j} = distances.shift();

        connect(i, j);
    }

    // return group sizes order desecending
    const sizes = group_size.filter(size => size > 0);
    sizes.sort((a, b) => b - a);
    return sizes;
}

let K = 1000;
if (debug) 
    K = 10;

const cluster_sizes = find_cluster_sizes(coordinates, K);

// comptue the product of first three elements in cluster_sizes
const product_of_first_three = cluster_sizes.slice(0, 3).reduce((acc, val) => acc * val, 1);

console.log("Part one:", product_of_first_three);



// find the last points to get all points connected
function find_last_points_to_get_all_points_connected(coords){
    const n = coords.length;
    let gropu_remaining = n;
    
    // Initialize a groud ip for each point from 1 to n
    const gropu_id = new Array(n);
    for (let i = 0; i < n; i++)
        gropu_id[i] = i;

    // A list of gropu sizez initailize 1 for each group
    const group_size = new Array(n).fill(1);

    // compute all pairwise distances
    const distances = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const dist = euclideanDistance(coords[i], coords[j]);
            distances.push({dist, i, j});
        }
    }

    // define a function to connect two points togetehr
    function connect(i, j){
        if (gropu_id[i] === gropu_id[j])
            return; // already connected

        const group_i = gropu_id[i];
        const group_j = gropu_id[j];

        // merge all points in group_j to group_i
        for (let p = 0; p < n; p++){
            if (gropu_id[p] === group_j){
                gropu_id[p] = group_i;
                group_size[group_i] += 1;
                group_size[group_j] -= 1;
            }
        }

        if (group_size[group_j] === 0)
            gropu_remaining -= 1;
    }

    // sort distances in ascending order ( by first element in tuple)
    distances.sort((a, b) => a.dist - b.dist);

    while (gropu_remaining > 1){
        // pop first element from distances
        if (distances.length === 0) break;
        const {dist, i, j} = distances.shift();

        connect(i, j);
        if (gropu_remaining === 1)
            return {i, j}
    }

    return NaN;
}

const last_points = find_last_points_to_get_all_points_connected(coordinates);

// compute the product of X coordinates of the last points
const product_of_last_points_x = coordinates[last_points.i][0] * coordinates[last_points.j][0];

console.log("Part two:", product_of_last_points_x);