const fs = require("node:fs")
const path = require("node:path")

const input = fs.readFileSync(path.join(__dirname, "../inputs/07.txt"), "utf8")
const lines = input.trim().split("\n")

const hands = lines.map(l => {
  const [cards, bid] = l.split(" ")
  return { cards, bid: +bid }
})

//Map cards and hexadecimal strengths
const cards = {
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 6,
  "8": 7,
  "9": 8,
  "T": 9,
  // "J": "A", //Part 01
  "J": 0, //Part 02
  "Q": "B",
  "K": "C",
  "A": "D"
}

const getKind = handCards => {
  const cards = handCards.split("")
  // let differentCards = [...new Set(cards)] //Part 01
  let differentCards = [...new Set(cards)].filter(c => c !== "J") //Part 02
  const jokers = cards.filter(c => c === "J").length

  switch(differentCards.length) {
    case 5:
      return 1
    case 4:
      return 2
    case 3:
      if(
        differentCards.some(
          dC => cards.filter(c => c === dC)
                    //  .length === 3 //Part 01
                     .length === 3 - jokers //Part 02
        )
      ) {
        return 4
      }
      return 3
    case 2:
      if(
        differentCards.some(
          dC => cards.filter(c => c === dC)
                    //  .length === 4 //Part 01
                     .length === 4 - jokers //Part 02
        )
      ) {
        return 6
      }
      return 5
    default:
      return 7
  }
}

//Create a score using hexadecimal values
const getHandScore = handCards => {
  let score = "0x" + getKind(handCards)
  handCards.split("").forEach(card => {
    score += cards[card]
  });
  return Number(score)
}

const getBidOrderedByScore = hands => {
  const bidScores = hands.map(h => ({ score: getHandScore(h.cards), bid: h.bid }))
  return bidScores.sort((a,b) => a.score - b.score).map(bS => bS.bid)
}

const result = getBidOrderedByScore(hands).reduce((sum, bid, rank) => bid * (rank+1) + sum, 0)
console.log(result)