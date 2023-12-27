const fs = require("node:fs");
const path = require("node:path");

const input = fs
  .readFileSync(path.join(__dirname, "../inputs/13.txt"), "utf8")
  .replace(" ", "");

const patterns = input.split("\n\n").map(p => p.split("\n"))

const getNotes = pattern => {
  const result = { rows: [], columns: [] }
  rowCheck:
    for(let i = 0; i < pattern.length - 1; i++) {
      if(pattern[i] === pattern[i+1]){
        if(!i || (i === pattern.length - 2)) { result["rows"].push(i+1) }
        for(let j = 0; (i - j >= 0) && (pattern.length - j - i - 1) > 0; j++) {
          if(pattern[i-j] !== pattern[i+j+1]) continue rowCheck
        }
        result["rows"].push(i+1)
      }
    }
  const columns = Array.from(
    { length: pattern[0].length },
    (_, j) => Array.from({ length: pattern.length }, (_, i) => pattern[i][j]).join("")
  )
  columnCheck:
    for(let i = 0; i < columns.length - 1; i++) {
      if(columns[i] === columns[i+1]){
        if(!i || (i === columns.length - 2)) { result["columns"].push(i+1) }
        for(let j = 0; (i - j >= 0) && (columns.length - j - i - 1) > 0; j++) {
          if(columns[i-j] !== columns[i+j+1]) continue columnCheck
        }
        result["columns"].push(i+1)
      }
    }
  return {
    rows: [...new Set(result.rows)],
    columns: [...new Set(result.columns)]
  }
}

//Part 01
// const result = patterns.reduce((sum, pattern, i) => {
//   const note = getNotes(pattern)
//   return sum + (note.rows.length ? note.rows[0]*100 : note.columns[0])
// }, 0)

//Part02
const replaceChar = (str, char, index) =>
  str.substring(0, index) + char + str.substring(index+1)

const result = patterns.reduce((sum, pattern, i) => {
  const note = getNotes(pattern)
  let correctNote
  check:
    for(let i = 0; i <= pattern.length - 1; i++){
      for(let j = 0; j <= pattern[0].length - 1; j++){
        const newPattern = [...pattern]
        newPattern[i] = replaceChar(newPattern[i], newPattern[i][j] === "." ? "#" : ".", j)
        const newNote = getNotes(newPattern, true)
        if(
          (newNote.rows.length || newNote.columns.length) &&
          JSON.stringify(note) !== JSON.stringify(newNote)
        ){
          correctNote = newNote;
          break check
        }
      }
    }
    const result = {
      rows: correctNote.rows.filter(r => !note.rows.includes(r)),
      columns: correctNote.columns.filter(r => !note.columns.includes(r))
    }
  return sum + (result.rows.length ? result.rows[0]*100 : result.columns[0])
}, 0)

console.log(result)