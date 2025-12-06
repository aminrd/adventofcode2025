const fs = require("fs");
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day5.txt";

function loadInventoryFile(filename) {
    const text = fs.readFileSync(filename, 'utf8').trim();

    const lines = text.split(/\r?\n/);

    let ranges = [];
    let ingredientIds = [];

    let isRangeSection = true;

    for (let line of lines) {
        line = line.trim();

        // Blank line means switch to ingredient section
        if (line === '') {
            isRangeSection = false;
            continue;
        }

        if (isRangeSection) {
            // Parse "L-R"
            const match = line.match(/^(\d+)-(\d+)$/);
            if (match) {
                ranges.push({
                    start: Number(match[1]),
                    end: Number(match[2])
                });
            }
        } else {
            // Ingredient IDs are single integers
            ingredientIds.push(Number(line));
        }
    }

    return { ranges, ingredientIds };
}

const { ranges, ingredientIds } = loadInventoryFile(filename);

// helper function to check if an id is in any range
function isIdInRanges(id, ranges) {
    for (let range of ranges) {
        if (id >= range.start && id <= range.end) {
            return true;
        }
    }
    return false;
}

let partOne = 0;
for (let id of ingredientIds) {
    if (isIdInRanges(id, ranges))
        partOne++;
}

console.log("Part One:", partOne);


// sort ranges by start
ranges.sort((a, b) => a.start - b.start);

let totalIdsInRanges = ranges[0].end - ranges[0].start + 1;
let last_end = ranges[0].end;
let i=1; 

while (i < ranges.length) {
    const range = ranges[i];
    if (range.end <= last_end){
      i++;
      continue;
    }

    let start = Math.max(range.start, last_end + 1);
    totalIdsInRanges += range.end - start + 1;
    last_end = range.end;
    i++;
}

console.log("Part Two:", totalIdsInRanges);