const fs = require("node:fs")
const path = require("node:path")

const input = fs
  .readFileSync(path.join(__dirname, "../inputs/15.txt"), "utf8")
  .replace("\n", "")

const getNextValue = (newChar, currentValue = 0) =>
  (currentValue + newChar.charCodeAt(0)) * 17 % 256

const getHashValue = str => str.split("").reduce((sum, char) => getNextValue(char, sum), 0)

const steps = input.split(",")

//Part 01
// const result = steps.reduce((sum, step) => sum + getHashValue(step), 0)

const boxes = Array(256).fill([])

const getStepInfo = step => {
  const [_, label, op, focalLength] = [...step.matchAll(/(.+)(\-|=){1}(.*)/g)][0]
  return { label, op, focalLength }
}

const processStep = stepInfo => {
  const boxIndex = getHashValue(stepInfo.label)
  if(stepInfo.op === "-") {
    boxes[boxIndex] = boxes[boxIndex].filter(v => v[0] !== stepInfo.label)
  } else {
    const lenIndex = boxes[boxIndex].findIndex(v => v[0] === stepInfo.label)
    if(lenIndex !== -1) {
      boxes[boxIndex][lenIndex][1] = stepInfo.focalLength
    } else {
      boxes[boxIndex] = [...boxes[boxIndex], [stepInfo.label, stepInfo.focalLength]]
    }
  }
}

steps.forEach(s => processStep(getStepInfo(s)))

const result = boxes.reduce(
  (sum, box, boxIndex) =>
    sum + box.reduce((sum, len, lenIndex) =>
      sum + ((boxIndex + 1) * (lenIndex + 1) * +len[1])
    , 0)
  , 0
)

console.log(result)