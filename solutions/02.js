const fs = require("node:fs")
const path = require("node:path")

const input = fs.readFileSync(path.join(__dirname, "../inputs/02.txt"), "utf8")

const cubes = {
  red: 12,
  green: 13,
  blue: 14
}

const createRegex = color => new RegExp(`(\\d+) ${color}`, "g")
const getColorSets = (game, color) => [...game.matchAll(createRegex(color))].map(m => +m[1])
const isColorPossible = (game, color) => getColorSets(game, color).every(v => cubes[color] >= v)
const minimumSetForColor = (game, color) => getColorSets(game, color).sort((a,b) => b - a)[0]
const getGameId = game => +[...game.matchAll(/Game (\d+):/g)][0][1]
//Return the game id if is a possible game or 0 if is not
const returnGameId = game => Object.keys(cubes).every(k => isColorPossible(game, k)) ? getGameId(game) : 0
const returnGamePower = game => Object.keys(cubes).map(k => minimumSetForColor(game, k)).reduce((p,c) => p * c, 1)

const games = input.trim().split("\n")
//Part 01
// const result = games.reduce((p,c) => p + returnGameId(c), 0)
//Part 02
const result = games.reduce((p,c) => p + returnGamePower(c), 0)

console.log(result)