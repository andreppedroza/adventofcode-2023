const fs = require("node:fs");
const path = require("node:path");

const input = fs
  .readFileSync(path.join(__dirname, "../inputs/10.txt"), "utf8")
  .replace(" ", "");

const lines = input.trim().split("\n");

const pipeValues = {
  "|": [1, 0, 1, 0], // [N,E,S,W]
  "-": [0, 1, 0, 1],
  "L": [1, 1, 0, 0],
  "J": [1, 0, 0, 1],
  "7": [0, 0, 1, 1],
  "F": [0, 1, 1, 0],
  ".": [0, 0, 0, 0],
  "S": [1, 1, 1, 1],
};

const matrice = lines.map((l) => l.split(""));

const getStartPoint = () => {
  const l = lines.findIndex((l) => l.includes("S"));
  const c = lines[l].indexOf("S");
  return [l, c];
};

const getNextPoint = (point, move) => [
  point[0] + move[2] - move[0],
  point[1] + move[1] - move[3],
]

const invertMove = move => {
  switch (move.join("")) {
    case "1000":
      return [0, 0, 1, 0];
    case "0100":
      return [0, 0, 0, 1];
    case "0010":
      return [1, 0, 0, 0];
    case "0001":
      return [0, 1, 0, 0];
    default:
      return [0, 0, 0, 0];
  }
};

const getNextMove = (nextPipe, currentMove) => {
  const nextPipeValue = pipeValues[nextPipe]
  const nextEntrance = invertMove(currentMove)
  const nextMove = nextPipeValue.map((v, i) => v - nextEntrance[i])
  return nextMove
}

const getPathMoves = (startPoint, currentMove) => {
  let moves = []
  while(true){
    moves.push(currentMove)
    const nextPoint = getNextPoint(startPoint, currentMove)
    const nextPipe = matrice[nextPoint[0]][nextPoint[1]]
    if(nextPipe === "S") { break; }
    const nextMove = getNextMove(nextPipe, currentMove)
    startPoint = nextPoint; currentMove = nextMove
  }
  return moves
}

const isAValidPoint = point => !(
  point.some(n => n < 0) ||
  point[0] >= matrice.length ||
  point[1] >= matrice[0].length
)

const startPoint = getStartPoint();

const nextValidMoves = [
  [1, 0, 0, 0], // Move to North
  [0, 0, 1, 0], // Move to South
  [0, 1, 0, 0], // Move to East
  [0, 0, 0, 1], // Move to West
].filter((currentMove) => {
  const nextPoint = getNextPoint(startPoint, currentMove)
  if(!isAValidPoint(nextPoint)) return false
  const nextPipe = matrice[nextPoint[0]][nextPoint[1]]
  const nextMove = getNextMove(nextPipe, currentMove)
  return nextMove.sort().join("") === "0001" // Is a valid move?
});

const pathMoveList = getPathMoves(startPoint, nextValidMoves[0])
//Part 01
// const result = pathMoveList.length / 2

//Part 02
const getRawTileMatrice = (reverse = false) => {
  const tileMatrice = []

  for(let i = 0; i < matrice.length; i++) {
    tileMatrice[i] = [] 
    for(let j = 0; j < matrice[0].length; j++) {
      tileMatrice[i][j] = "." 
    }
  }
  
  //Create matrice to track points types(P:Path / I:Inside Path / O: Outside Path)
  pathMoveList.reduce((point, move) => {
    const nextPoint = getNextPoint(point, move)
    tileMatrice[nextPoint[0]][nextPoint[1]] = "P"
    return nextPoint
  }, startPoint)
  
  let [point, lastMove] = [startPoint, pathMoveList.at(-1)]
  pathMoveList.slice(0, -1).forEach((move, moveIndex) => {
    const nextPoint = getNextPoint(point, move)
    const nextMove = pathMoveList[moveIndex+1]
    const insideDirection = reverse ? lastMove : invertMove(lastMove)
    const insidePoint = getNextPoint(point, insideDirection)
    if(
      isAValidPoint(insidePoint) &&
      tileMatrice[insidePoint[0]][insidePoint[1]] === "."
    ) {
      tileMatrice[insidePoint[0]][insidePoint[1]] = "I"
    }
    if(move.join("") !== nextMove.join("")) {
      if(reverse && (lastMove.join("") !== nextMove.join(""))) {
        const invertedNextMove = invertMove(nextMove)
        const edgeMove = move.map((v, i) => v + invertedNextMove[i])
        const edgePoint = getNextPoint(point, edgeMove)
        if(
          isAValidPoint(edgePoint) &&
          tileMatrice[edgePoint[0]][edgePoint[1]] === "."
        ) {
          tileMatrice[edgePoint[0]][edgePoint[1]] = "I"
        }
      }
      lastMove =
        lastMove.join("") === nextMove.join("")
          ? invertMove(move)
          : move
    }
    point = nextPoint
  })

  return tileMatrice
} 

const fillNeighborsInsiders = (point, tileMatrice) => {
  const neighbors = [
    [point[0]-1,point[1]],
    [point[0]+1,point[1]],
    [point[0],point[1]-1],
    [point[0],point[1]+1]
  ].filter(n => isAValidPoint(n) && tileMatrice[n[0]][n[1]] !== "P")
   
  const notAnInsider = neighbors.filter(n => tileMatrice[n[0]][n[1]] !== "I")
  if(neighbors.length !== notAnInsider.length) {
    tileMatrice[point[0]][point[1]] = "I"
    notAnInsider.forEach(point => fillNeighborsInsiders(point, tileMatrice))
  }
}

const fillRemainingsPoints = tileMatrice => {
  //Fill remaining Insiders
  for(let i = 0; i < tileMatrice.length; i++){
    for(let j = 0; j < tileMatrice[0].length; j++){
      const neighbors = [
        [i-1,j], [i+1,j],
        [i,j-1], [i,j+1]
      ].filter(n => isAValidPoint(n))
      if(tileMatrice[i][j] === "."){
        if(neighbors.some(n => tileMatrice[n[0]][n[1]] === "I")) {
          fillNeighborsInsiders([i,j], tileMatrice)
        }
      }
    }
  }
  //Fill Outsiders
  for(let i = 0; i < tileMatrice.length; i++){
    for(let j = 0; j < tileMatrice[0].length; j++){
      if(tileMatrice[i][j] === "."){
        tileMatrice[i][j] = "O"
      }
    }
  }
}

const needReverse = tileMatrice => {
  const edges = tileMatrice[0].concat(
    tileMatrice.at(-1),
    tileMatrice.slice(1, -1)
      .reduce(
        (result, line) => result.concat(line[0], line.at(-1)),
        []
  ))
  return edges.includes("I")
}

const getTileMatrice = () => {
  let matrice = getRawTileMatrice()
  fillRemainingsPoints(matrice)
  if(needReverse(matrice)) {
    matrice = getRawTileMatrice(true)
    fillRemainingsPoints(matrice)
  }
  return matrice
}

const tileMatrice = getTileMatrice()

const result = tileMatrice.reduce((sum, line) => sum + line.filter(v => v === "I").length, 0)

//Print Matrice
// const strMatrice = tileMatrice.reduce((matrice, line) => matrice + line.join("") + "\n", "")
// console.log(strMatrice)

console.log(result)
