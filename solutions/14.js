const fs = require("node:fs");
const path = require("node:path");

const input = fs
  .readFileSync(path.join(__dirname, "../inputs/14.txt"), "utf8")
  .replace(" ", "");

const rotateMatrice = (matrice, to = "right") => {
  const newMatrice = []
  for(let j = 0; j < matrice[0].length; j++){
    const newLine = Array.from({ length: matrice.length }, (_, i) =>
      matrice[
        to === "right" ? i : matrice.length - i - 1
      ][j])
    newMatrice.push(newLine)
  }
  return newMatrice
}

const moveRocks = (matrice, to = "left") => {
  const newMatrice = [...matrice]
  const replace = to === "left" ? ".O" : "O."
  for(let i = 0; i < newMatrice.length; i++){
    let line = newMatrice[i].join("")
    while(line.includes(replace)) {
      line = line.replaceAll(replace, replace.split("").reverse().join(""))
    }
    newMatrice[i] = line.split("")
  }
  return newMatrice
}

const getLoad = matrice => matrice.reduce(
  (sum, line, i) =>
    sum + line.filter(v => v === "O").length * (matrice.length - i)
  , 0
)

const matrice = input.split("\n").map(l => l.split(""))

//Part 01
// const rotatedMatrice = rotateMatrice(matrice)
// const movedMatrice = moveRocks(rotatedMatrice)
// const finalMatrice = rotateMatrice(movedMatrice, "left")
// const result = getLoad(finalMatrice)

//Part 02
const cycleMatrice = matrice => {
  let newMatrice = matrice
  for(let i = 0; i < 4; i++){
    newMatrice = moveRocks(rotateMatrice(newMatrice, "left"), "right")
  }
  return newMatrice
}

const getFinalMatrice = (matrice, cycles) => {
  const uniqueMatrices = []
  let breakPoint = 0
  for(let i = 1; i <= cycles; i++){
    const newMatrice = JSON.stringify(cycleMatrice(
      JSON.parse(uniqueMatrices.at(-1) ??
      JSON.stringify(matrice))
    ))
    const newBreakPoint = uniqueMatrices.indexOf(newMatrice)
    if(newBreakPoint !== -1) {
      breakPoint = newBreakPoint
      break
    }
    uniqueMatrices.push(newMatrice)
  }
  const index = ((cycles - breakPoint - 1) % (uniqueMatrices.length - breakPoint)) + breakPoint
  return JSON.parse(uniqueMatrices[index])
}

const finalMatrice = getFinalMatrice(matrice, 1_000_000_000)

const result = getLoad(finalMatrice)

console.log(result)