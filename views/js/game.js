var marioPos = {
  x: 0,
  y: 0
}
var peachPos = {
  x: board.length - 1,
  y: board.length - 1
}
var nbPickedMushrooms = 0
var potentialsMap = new Map()
var optimalPath = computeOptimalPath()
var showOptimalPath = false

function generateTable () {
  var gameBoard = document.getElementById('gameBoard')
  gameBoard.setAttribute('class', 'table-responsive')

  var table = document.createElement('table')
  table.setAttribute('id', 'table')
  table.className += 'table table-bordered'

  var tbody = document.createElement('tbody')
  table.appendChild(tbody)

  for (let row = 0; row < board.length; row++) {
    let tableRow = document.createElement('tr')
    tableRow.setAttribute('id', 'row-' + row)
    tableRow.setAttribute('class', 'row')

    for (let column = 0; column < board.length; column++) {
      let tableCell = document.createElement('td')
      tableCell.setAttribute('id', 'cell-' + row + '-' + column)
      tableCell.setAttribute('class', 'cell')
      tableCell.style.height = Math.round(100 / board.length) + 'vh'

      if (row === peachPos.y && column === peachPos.x) {
        tableCell.setAttribute('id', 'peach')
      }

      if (row === marioPos.y && column === marioPos.x) {
        tableCell.setAttribute('id', 'mario')
        board[row][column].visited = true
      }

      if (board[row][column].mushroom) {
        tableCell.className += ' mushroom'
      }

      if (showOptimalPath && checkPositionPresence(optimalPath, {x: column, y: row})) {
        tableCell.className += ' optimal'
      }

      if (board[row][column].visited) {
        tableCell.className += ' visited'
      }

      tableRow.appendChild(tableCell)
    }

    tbody.appendChild(tableRow)
  }

  gameBoard.appendChild(table)
}

window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "ArrowDown":
      moveDown()
      break;
    case "ArrowRight":
      moveRight()
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);

//Try to move Mario to the right
function moveRight () {
  //If we can move Mario to the right
  if (marioPos.x + 1 < board.length) {
    moveMario(marioPos.x + 1, marioPos.y)
  } else {

  }
}

//Try to move Mario down
function moveDown () {
  //If we can move Mario down
  if (marioPos.y + 1 < board.length) {
    moveMario(marioPos.x, marioPos.y + 1)
  } else {

  }
}

function moveMario (x, y) {
  marioPos.x = x
  marioPos.y = y

  //Check if a mushroom is present
  if (board[marioPos.y][marioPos.x].mushroom) {
    nbPickedMushrooms++
    document.getElementById('nbPickedMushrooms').innerHTML = nbPickedMushrooms.toString()
  }

  if (marioPos.x === peachPos.x && marioPos.y === peachPos.y) {
    showOptimalPath = true
    window.alert(`Congratulations ! You saved Princess Peach ! You picked ${nbPickedMushrooms} mushrooms on the way.`)
  }

  refreshTable()
}

function refreshTable () {
  var gameBoard = document.getElementById('gameBoard')
  gameBoard.removeChild(document.getElementById('table'))
  generateTable()
}

function listMushrooms () {
  let mushrooms = []

  for (let row = 0; row < board.length; row++) {
    for(let column = 0; column < board.length; column++) {
      if (board[row][column].mushroom) {
        mushrooms.push({pos: {x: column, y: row}})
      }
    }
  }
  return mushrooms
}

function computeMushroomPotential (mushroom, mushrooms) {
  if (!potentialsMap.has(mushroom.pos)) {
    let potential = 1
    //console.log(`Computing (${mushroom.pos.x}, ${mushroom.pos.y}) potential.`)
    let accessibleMushrooms = getAccessibleMushroom(mushroom.pos, mushrooms)
    let potentials = getPotentials(accessibleMushrooms)

    if (potentials.length > 0) {
      potential += Math.max(...potentials)
    }

    potentialsMap.set(mushroom.pos, potential)
  }

  //console.log(`Potential of (${mushroom.pos.x}, ${mushroom.pos.y}) is ${potentialsMap.get(mushroom.pos)}`)
  return potentialsMap.get(mushroom.pos)
}

function computeOptimalPath () {
  let optimalPath = []
  let mushrooms = listMushrooms()
  let currentPos = {x: 0, y: 0}

  mushrooms.forEach((mushroom) => {
    computeMushroomPotential(mushroom, mushrooms)
  })

  while (currentPos.x < peachPos.x && currentPos.y < peachPos.y) {
    let accessibleMushrooms = getAccessibleMushroom(currentPos, mushrooms)
    let maxPotentialPos = getMaxPotentialPosition(accessibleMushrooms)
    let path = getPathBetween(currentPos, maxPotentialPos)
    optimalPath = optimalPath.concat(path)
    currentPos = maxPotentialPos

    // If potential is 1 then there is no other mushroom between the current position and Peach. So get path to Peach
    if (potentialsMap.get(currentPos) === 1) {
      optimalPath = optimalPath.concat(getPathBetween(currentPos, peachPos))
    }
  }

  return optimalPath
}

function getAccessibleMushroom (pos, mushrooms) {
  return mushrooms.filter((mushroom) => {
    return (mushroom.pos.x >= pos.x && mushroom.pos.y >= pos.y && !(mushroom.pos.x === pos.x && mushroom.pos.y === pos.y))
  })
}

function getPotentials (mushrooms) {
  return mushrooms.map((mushroom) => {
    return computeMushroomPotential(mushroom, mushrooms)
  })
}

function getMaxPotentialPosition (mushrooms) {
  let max = 0
  let pos = {x: 0, y: 0}

  mushrooms.forEach((mushroom) => {
    if (potentialsMap.has(mushroom.pos) && potentialsMap.get(mushroom.pos) > max) {
      pos = mushroom.pos
      max = potentialsMap.get(mushroom.pos)
    }
  })

  return pos
}

function getPathBetween (posTopLeft, posBottomRight) {
  let positions = []
  let currentPos = posTopLeft

  positions.push(Object.assign({}, currentPos))

  while (currentPos.x < posBottomRight.x) {
    currentPos.x++
    positions.push(Object.assign({}, currentPos))
  }

  while (currentPos.y < posBottomRight.y) {
    currentPos.y++
    positions.push(Object.assign({}, currentPos))
  }

  return positions
}

function checkPositionPresence (positions, pos) {
  let value = false

  positions.forEach((position) => {
    if (position.x === pos.x && position.y === pos.y) {
      value = true
    }
  })

  return value
}

document.getElementById('optimalPath').addEventListener('click', () => {
  showOptimalPath = !showOptimalPath
  console.log(`Optimal path is now ${showOptimalPath}`)
  refreshTable()
})

generateTable()