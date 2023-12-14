const fs = require("node:fs")
const path = require("node:path")

const input = fs.readFileSync(path.join(__dirname, "../inputs/01.txt"), "utf8")

const lines = input.trim().split("\n")
const numbers = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine"
]

const joins = {
  "oneight": "18",
  "twone": "21",
  "threeight": "38",
  "fiveight": "28",
  "eightwo": "82",
  "eighthree": "83",
  "nineight": "98"
}


const result = lines.map(line => {
  line = line.replaceAll(/oneight|twone|threeight|fiveight|eightwo|eighthree|nineight/g, v => joins[v])
  // Part 01
  // let digits = [...line.matchAll(/\d/g)].map(d => d[0])
  // Part 02
  let digits = [...line.matchAll(/\d|one|two|three|four|five|six|seven|eight|nine/g)].map(d => d[0])
  digits = digits.map(d => {
    const index = numbers.indexOf(d)
    return index >= 0 ? index + "" : d
  })
  const num = +(digits.at(0) + digits.at(-1))
  return num
}).reduce((p,c) => p + c, 0)

console.log(result)