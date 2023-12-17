const fs = require("node:fs")
const path = require("node:path")

const input = fs.readFileSync(path.join(__dirname, "../inputs/05.txt"), "utf8")

const seeds = [...input.matchAll(/seeds: (.+)/g)][0][1] //Get seeds separated by spaces
                .split(" ")
                .map(s => +s)

const maps = [
    ...input.matchAll(/.+:\n((\d+|\s)+)/gm)
  ].map(
    v =>
      v[1] // Get lines with only numbers or blank chars(Regex Group 1)
        .split("\n") // split lines
        .filter(v => !!v) // remove blank lines
        .map(
          v => 
            v.split(" ") // split numbers
            .map(n => +n) // convert string to number
        )
    )

const getLocationFromSeed = seed => maps.reduce((prevMapValue, currentMap) => {
  const correctRange = currentMap.find(r => (r[1] <= prevMapValue) && (r[1] + r[2] >= prevMapValue))
  if(correctRange) {
    return prevMapValue - correctRange[1] + correctRange[0]
  }
  return prevMapValue
}, seed)

//Part 01
// const result = seeds.map(s => getLocationFromSeed(s)).sort((a,b) => a - b)[0]

//Part 02
const getNextRanges = (range, nextMap) => {
  const [begin, end] = range
  let i = begin
  const ranges = []
  while(i <= end) {
    const nextRange = nextMap.find(v => (i >= v[1]) && (i < v[1] + v[2]))
    if(!nextRange) { //If no range is found, just add a range with the same values
      ranges.push([i, end])
      break;
    }
    if(nextRange[1] + nextRange[2] > end) { //If the range has "end" inside of it, just convert the numbers and break the loop
      ranges.push([i - nextRange[1] + nextRange[0], end - nextRange[1] + nextRange[0]])
      break;
    } else { //If end is not inside the range, push a new converted range and continue to the next iteration
      ranges.push([i - nextRange[1] + nextRange[0], nextRange[0] + nextRange[2] - 1])
      i = nextRange[1] + nextRange[2]
    }
  }
  return ranges
}

const seedRanges = []
for(let i = 0; i < seeds.length; i += 2) {
  seedRanges.push([seeds[i], seeds[i] + seeds[i+1] - 1])
}

const result = maps // Iterate through all maps
                .reduce((prevRanges, currentMap) => // Get previous map ranges
                  prevRanges
                    .map(r => getNextRanges(r, currentMap)) // Convert it to current map ranges
                    .reduce((allRanges, currentRanges) => [...allRanges, ...currentRanges], []), //Flatten all ranges in a one-dimensional array
                  seedRanges // Use seedRanges as initial range value to iterate
                )
                .sort((a, b) => a[0] - b[0]) // Sort all ranges by its first value
                [0] // Get the first range
                [0] // Get the first value of the range

console.log(result)