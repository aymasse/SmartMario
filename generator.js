function generateBoard (size, percent) {
  console.log(`Generating a board of size ${size} with ${percent}% of mushrooms.`)
  let board = []

  //Iterate over rows
  for (let r = 0; r < size; r++) {
    let row = []
    let mushIndexes = []
    let nbMushrooms = Math.round(size * (percent / 100))

    //Populate the array of mushrooms indexes with randomly generated numbers.
    while (mushIndexes.length < nbMushrooms) {
      let value = getRandomInt(0, size)

      if (!mushIndexes.includes(value) && !(r === 0 && value === 0) && !(r === size - 1 && value === size - 1)) {
        mushIndexes.push(value)
      }
    }

    //Populate row with boolean. True if a Mushroom is present. False otherwise.
    for (let c = 0; c < size; c++) {
      row.push({mushroom: mushIndexes.includes(c), visited: false})
    }

    board.push(row)
  }

  return board
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  generateBoard: generateBoard
}