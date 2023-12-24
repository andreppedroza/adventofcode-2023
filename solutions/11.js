const fs = require("node:fs");
const path = require("node:path");

const input = fs
  .readFileSync(path.join(__dirname, "../inputs/11.txt"), "utf8")
  .replace(" ", "");

const lines = input.trim().split("\n");

const universe = lines.map(l => l.split(""))

const getBlanks = universe => {
  const [blankLines, blankColumns] = [[],[]]
  let i = 0;
  while(true){
    const line = universe[i]
    const column = Array.from({ length: universe.length }, (_, j) => universe[j][i]) 
    if(line && line.every(v => v === ".")) blankLines.push(i)
    if(column.every(v => v === ".")) blankColumns.push(i)
    if(!line && column.every(v => !v)) break
    i++
  }
  return [blankLines, blankColumns]
}

const getGalaxies = universe => {
  const galaxies = []
  for(let i = 0; i < universe.length; i++){
    for(let j = 0; j < universe[0].length; j++) {
      if(universe[i][j] === "#") galaxies.push([i,j])
    }
  }
  return galaxies
}

const getGalaxyDistance = (start, end, blanks, multiplier) => {
  const lines = [start[0], end[0]].sort((a,b) => a - b)
  const columns = [start[1], end[1]].sort((a,b) => a - b)
  const blankLinesBetween = blanks[0].filter(i => i > lines[0] && i < lines[1]).length
  const blankColumnsBetween = blanks[1].filter(i => i > columns[0] && i < columns[1]).length
  return Math.abs(start[0] - end[0]) +
         Math.abs(start[1] - end[1]) +
         ((blankLinesBetween + blankColumnsBetween) * (multiplier - 1))
}

const galaxies = getGalaxies(universe)
const blanks = getBlanks(universe)

// Part 01
// const multiplier = 2
// Part 02
const multiplier = 1_000_000

const result = galaxies.reduce((sum, g, i) => {
  if(i === galaxies.length - 1) return sum
  let distanceSum = 0
  for(let k = 1; k < galaxies.length - i; k++){
    distanceSum += getGalaxyDistance(g, galaxies[i + k], blanks, multiplier)
  }
  return sum + distanceSum
}, 0)

console.log(result)