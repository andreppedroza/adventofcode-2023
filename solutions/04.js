const fs = require("node:fs")
const path = require("node:path")

const input = fs.readFileSync(path.join(__dirname, "../inputs/04.txt"), "utf8")

const lines = input.trim().split("\n")

const cards = lines.map(l => {
  const lineParts = l.split("|")
  const winNumbers = lineParts[0].split(/\s+/g).slice(2, -1).map(n => +n)
  const cardNumbers = lineParts[1].split(/\s+/g).slice(1).map(n => +n)

  return { winNumbers, cardNumbers }
})

const getCardWinNumbers = card => card.cardNumbers.filter(cN => card.winNumbers.includes(cN))
const getCardPoints = card => {
  const cardWinNumbers = getCardWinNumbers(card)
  return cardWinNumbers.length ? Math.pow(2, cardWinNumbers.length - 1) : 0
}

//Part 01
// const result = cards.reduce((sum, card) => sum + getCardPoints(card), 0)
//Part 02
// Init with just one card(the originals)
const cardNumbers = Array.from({length: lines.length}, _ => 1)
const updateCardNumbers = (card, cardIndex) => {
  const winNumbersLen = getCardWinNumbers(card).length
  //Iterate between the next winNumbersLen(th) cards and add the number of card clones...
  for(let i = 1; i <= winNumbersLen; i++) {
    //Increase the number of the next card by the number of the current card
    cardNumbers[cardIndex + i] += cardNumbers[cardIndex]
  }
}

for(let i = 0; i < cards.length; i++) {
  updateCardNumbers(cards[i], i)
}

const result = cardNumbers.reduce((sum, cardNumber) => sum + cardNumber, 0)

console.log(result)