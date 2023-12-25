const fs = require("fs")
const path = require("path")

const input = fs
  .readFileSync(path.join(__dirname, "../inputs/12.txt"), "utf8")

const lines = input.trim().split("\n").map(l => {
  const [row, criteria] = l.trim().split(" ")
  return [
    row,
    criteria.split(",").map(n => +n)
  ]
})

const memo = func => { //Cache results
  const cache = {}
  return (...args) => cache[JSON.stringify(args)] ??= func(...args)
}

const getArrangements = memo((row, criteria) => {
  if(!criteria.length) return +!row.includes("#") // If the criteria is empty and the row has no broken spring then it is a valid arrangement
  if(// If the row is not sized enough to get all springs inside then it is not a valid arrangement
    row.length < criteria.reduce((sum, v) => sum + v, 0) +
    criteria.length - 1
  ) return 0
  if(row[0] === ".") return getArrangements(row.slice(1), criteria) // If row start with a working spring just ignore it
  if(row[0] === "#"){
    if(row.slice(0, criteria[0]).includes(".") || row[criteria[0]] === "#") return 0 // If the row starts with a broken spring and cannot satisfy the first criteria(it does not have a working spring inside or neighboring a broken spring) then it is not a valid arrangement
    return getArrangements(row.slice(criteria[0] + 1), criteria.slice(1)) // If not, just test the next criteria
  }
  return ["#", "."].reduce((sum, v) => sum + getArrangements(v + row.slice(1), criteria), 0)// If gets here it is because it is not known if the first value is a broken or a working spring, so test the two possibilities
})

//Part 01
// const result = lines.reduce((sum, line) => sum + getArrangements(line[0], line[1]), 0)

//Part 02
const result = lines.reduce(
  (sum, line) => sum + 
    getArrangements(
      Array(5).fill(line[0]).join("?"),
      Array(5).fill(line[1]).flat()
    )
  , 0
)

console.log(result);