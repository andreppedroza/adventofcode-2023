const fs = require("node:fs")
const path = require("node:path")

const input = fs.readFileSync(path.join(__dirname, "../inputs/06.txt"), "utf8")
const lines = input.trim().split("\n")

const times = [...lines[0].matchAll(/\d+/g)].map(v => +v[0])
const records = [...lines[1].matchAll(/\d+/g)].map(v => +v[0])

const countBeatDistances = (time, record) => {
  let beatCount = 0
  let half = Math.floor(time / 2)
  if(time % 2 === 0) {//If time is even
    if(half * half > record) { beatCount++ } // And if when time hold and time left is equal, and the distance is greater then record, count as one beat
    half-- // Prevent count the case above two times
  }
  for(let i = half; i >= 1; i--) { // Begin the loop with the half of the time
    if(i * (time - i) > record) { beatCount += 2 } // If the value is greater then the record, count two times because the order of time hold and time left is relevant
    else { break; } //If not, just break
  }
  return beatCount
}

//Part 01
// const result = times.map((t, i) => countBeatDistances(t, records[i])).reduce((mult, count) => mult * count, 1)

//Part 02
const time = +times.reduce((p,c) => p + c, "")
const record = +records.reduce((p,c) => p + c, "")

console.log(countBeatDistances(time, record))