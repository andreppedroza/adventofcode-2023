const fs = require("node:fs")
const path = require("node:path")

const input = fs.readFileSync(path.join(__dirname, "../inputs/03.txt"), "utf8")

const rows = input.trim().split("\n")
const matrice = rows.map(row => row.split(""))

// Item can be especified by a regex. Ex.: numbers(\d+) and asterisks(\*).
const getItems = (row, regex) => [...row.matchAll(new RegExp(regex, "g"))].map(n => ({ value: n[0], index: n["index"] }))
// Return the left and right positions of an item.
const getSurroundingRowIndexes = (item, rowIndex) => {
  const indexes = []
  const inverseNumberIndex = item.index + item.value.length
  if(item.index > 0) indexes.push([rowIndex, item.index - 1])
  if(inverseNumberIndex < rows[rowIndex].length) indexes.push([rowIndex, inverseNumberIndex])
  return indexes
}
// Return all position inside an item.
const getInsideRowIndexes = (item, rowIndex) => [...Array(item.value.length).keys()].map(i => [rowIndex, i + item.index])
// Return all surrounding positions(Left, Right, Row Above, and Row Below)
const getSurroundingIndexes = (item, rowIndex) => {
  let indexes = []
  indexes = [...getSurroundingRowIndexes(item, rowIndex)]
  if(rowIndex !== 0) {
    indexes = [...indexes, ...getSurroundingRowIndexes(item, rowIndex - 1)]
    indexes = [...indexes, ...getInsideRowIndexes(item,rowIndex - 1)]
  }
  if(rowIndex !== rows.length - 1) {
    indexes = [...indexes, ...getSurroundingRowIndexes(item, rowIndex + 1)]
    indexes = [...indexes, ...getInsideRowIndexes(item,rowIndex + 1)]
  }
  return indexes
}
const isNumberPart = surroundingIndexes => surroundingIndexes.some(index => matrice[index[0]][index[1]] !== '.')

const numberParts = rows.map((row, rowIndex) => getItems(row, "\\d+").map(number => {
  const indexes = getSurroundingIndexes(number, rowIndex)
  if(isNumberPart(indexes)) number.surroundingIndexes = indexes
  return number
}).filter(n => !!n.surroundingIndexes)).reduce((allNumberParts, rowNumberParts) => [...allNumberParts, ...rowNumberParts], [])

const gearPositions = rows.map((row, rowIndex) => getItems(row, "\\*")
  .map(item => [rowIndex, item.index]))
  .reduce((allGears, rowGears) => [...allGears, ...rowGears], [])

const gearRatios = gearPositions.map(gearPosition => numberParts.filter(numberPart => {
  const isGearNumberPart = !!numberPart.surroundingIndexes.find(index => index[0] === gearPosition[0] && index[1] === gearPosition[1])
  return isGearNumberPart
          // Include only gears with two number parts                        Calculate ratio
})).filter(gearNumberParts => gearNumberParts.length === 2).map(gNP => +gNP[0].value * +gNP[1].value)

//Part 01
// const result = numberParts.reduce((sum, numberPart) => sum + +numberPart.value, 0)
//Part 02
const result = gearRatios.reduce((sum, gearRatio) => sum + gearRatio, 0)

console.log(result)