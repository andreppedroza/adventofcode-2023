const fs = require("node:fs")
const path = require("node:path")

const input = fs.readFileSync(path.join(__dirname, "../inputs/09.txt"), "utf8")
const lines = input.trim().split("\n")

const histories = lines.map(l => l.split(" ").filter(v => !!v).map(n => +n))

const getNextValue = (history) => {
  if(history.every(number => number === 0)) return 0
  const newHistory = []
  for(let i = 0; i < history.length -1; i++) {
    newHistory.push(history[i+1] - history[i])
  }
  return getNextValue(newHistory) + history.at(-1)
}

//Part 01
// const result = histories.reduce((sum, history) => sum + getNextValue(history), 0)

//Part 02
const result = histories.reduce((sum, history) => sum + getNextValue(history.reverse()), 0)

console.log(result)