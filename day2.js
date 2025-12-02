const fs = require("fs");
const args = process.argv.slice(2); // remove node and script path
const debug = args.includes("-debug"); // true if -debug is passed
let filename = debug ? "test.txt" : "day2.txt";

class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

function loadRangesFromFile(filename) {
  // read file as a single string
  const content = fs.readFileSync(filename, 'utf8').trim();

  if (!content) return [];

  // split by comma, each token should be something like "11-22"
  const tokens = content.split(',');

  const ranges = [];

  for (const token of tokens) {
    if (!token) continue; // skip empty entries

    const [startStr, endStr] = token.split('-');
    const start = Number(startStr);
    const end = Number(endStr);

    if (Number.isNaN(start) || Number.isNaN(end)) {
      throw new Error(`Invalid range token: ${token}`);
    }

    ranges.push(new Range(start, end));
  }

  return ranges;
}

let ranges = loadRangesFromFile(filename);

/**
 * Check if a number is an invalid ID:
 * digits = XX, XYXY, ABCABC, etc.
 */
function isInvalidID(num) {
  const s = String(num);

  // Must have even length
  if (s.length % 2 !== 0) return false;

  const half = s.length / 2;
  const a = s.slice(0, half);
  const b = s.slice(half);

  // Must not have leading zeros
  if (s[0] === '0') return false;

  return a === b;
}

/**
 * Given a Range { start, end }, return sum of all invalid IDs.
 */
function sumInvalidIDs(range) {
  let sum = 0;

  for (let n = range.start; n <= range.end; n++) {
    if (isInvalidID(n)) {
      sum += n;
    }
  }

  return sum;
}


let total = 0;
for (const r of ranges) 
    total += sumInvalidIDs(r);

console.log("Part one = " + total)


function isInvalidIDPartTwo(num) {
  const s = String(num);

  // no leading zeros allowed
  if (s[0] === '0') return false;

  const n = s.length;

  // Try all possible block sizes from 1 to n/2
  for (let block = 1; block <= Math.floor(n / 2); block++) {
    if (n % block !== 0) continue; // must divide perfectly

    const repeatCount = n / block;
    if (repeatCount < 2) continue; // must repeat at least twice

    const pattern = s.slice(0, block);
    let rebuilt = "";

    // build pattern repeated repeatCount times
    for (let i = 0; i < repeatCount; i++) {
      rebuilt += pattern;
    }

    if (rebuilt === s) return true;
  }

  return false;
}

function sumInvalidIDsPartTwo(range) {
  let sum = 0;

  for (let n = range.start; n <= range.end; n++) {
    if (isInvalidIDPartTwo(n)) {
      sum += n;
    }
  }

  return sum;
}

let totalPartTwo = 0;
for (const r of ranges) 
    totalPartTwo += sumInvalidIDsPartTwo(r);

console.log("Part two = " + totalPartTwo);