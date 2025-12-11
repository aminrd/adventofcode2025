import fs from 'fs';
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day11.txt";

// Read the file from filename in aaa: you hhh format
function readGraphFromFile(filename) {
    const lines = fs.readFileSync(filename, "utf8")
                    .trim()
                    .split(/\r?\n/);

    const graph = {};

    for (const line of lines) {
        if (!line.trim()) continue;

        // Split "aaa: you hhh"
        const [node, rest] = line.split(":").map(s => s.trim());

        // Handle nodes with no outputs (rest might be undefined)
        const adj = rest ? rest.split(/\s+/) : [];

        graph[node] = adj;
    }

    return graph;
}

const graph = readGraphFromFile(filename);

function find_paths(graph, start, finish){

    const ways = {finish: 1}

    function get_ways(node){
        if (node == finish)
            return 1;

        if(node in ways)
            return ways[node];

        let current = 0;
        for(let adj of graph[node])
            current += get_ways(adj);

        ways[node] = current;
        return current;
    }    

    return get_ways(start);
}

let part_one = find_paths(graph, "you", "out");
console.log("Part one = " + part_one);

/* 
I want to update this so that ways holds 4 numbers instead of just one  
first number of ways to reach to out without visiting dac and fft, one with only dac, one with only fft, one with both
*/
function find_paths_part_two(graph, start, finish){
    const ways = {};

    // accumulator = [none, onlyDAC, onlyFFT, both]
    function get_ways(node) {
        if (node === finish) {
            // exactly 1 valid path arriving at finish with the current state
            const res = [1, 0, 0, 0];
            return res;
        }

        // memo key
        // const key = node + "|" + state;
        const key = node;
        if (ways[key]) 
            return ways[key];

        
        let acc = [0, 0, 0, 0];

        for (const adj of graph[node] || []) {
            const childWays = get_ways(adj);
            acc[0] += childWays[0];
            acc[1] += childWays[1];
            acc[2] += childWays[2];
            acc[3] += childWays[3];
        }

        // accumulator = [none, onlyDAC, onlyFFT, both]
        if (node === "dac"){
            acc[1] += acc[0];
            acc[0] = 0;

            acc[3] += acc[2];
            acc[2] = 0;
        }
        else if (node === "fft")
        {
            acc[2] += acc[0];
            acc[0] = 0;

            acc[3] += acc[1];
            acc[1] = 0;
        }

        ways[key] = acc;
        return acc;
    }  

    return get_ways(start);
}

let part_two = find_paths_part_two(graph, "svr", "out");
console.log("Part two = " + part_two);