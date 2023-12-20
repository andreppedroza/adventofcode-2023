const fs = require("node:fs")
const path = require("node:path")

const input = fs.readFileSync(path.join(__dirname, "../inputs/08.txt"), "utf8")
const lines = input.trim().split("\n")

const navigator = lines[0].split("")

const nodeKeys = ["N", "L", "R"]

const nodes = lines
                .slice(2) // Get only lines with nodes
                .map(
                  l => [...l.matchAll(/[A-Z]+/g)] // Get values AAA, BBB, CCC...
                        .reduce((obj, value, i) => ({...obj, [nodeKeys[i]]: value[0]}), {}) // Create node object
                )


const getSteps = (start, stop = currentNode => true) => {
  let [node, steps, nodeIndex] = [nodes.find(n => n["N"] === start), 0, 0]

  while(!stop(node)) {
    steps++
    node = nodes.find(n => n["N"] === node[navigator[nodeIndex % navigator.length]])
    nodeIndex++
  }
  return steps
}

//Part 01
// const result = getSteps("AAA", node => node["N"] === "ZZZ")

//Part 02
function gcd(a, b) { 
  for (let temp = b; b !== 0;) { 
      b = a % b; 
      a = temp; 
      temp = b; 
  } 
  return a; 
} 

function lcm(a, b) { 
  const gcdValue = gcd(a, b); 
  return (a * b) / gcdValue; 
}

const initialNodes = nodes.filter(n => n["N"][2] === "A")
const initialNodeSteps = initialNodes.map(n => getSteps(n["N"], n => n["N"][2] === "Z"))

const result = initialNodeSteps.reduce(lcm, 1)
console.log(result)