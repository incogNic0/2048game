let currentBoard = [
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0]
]

let previousBoard = [];

function generateRandomTile() {
	const value = getValue(); // Generate random value (2 or 4) for new box
	const box = selectRandomBox(); // Get random box for new tile location
  if(box) {
    occupyBox(box,value); // Set tile value, display, and mark as occupied
    updateBoardArrays(box, value);
  } else {
    gameOver();
  }
}

function getValue() {
	const nums = [2, 4];
	return nums[Math.round(Math.random() * 1)];
}

function selectRandomBox() {
  // Get all unoccupied boxes
  const unoccupiedBoxes = document.querySelectorAll('[data-occupied="false"]');
  const numBoxes = unoccupiedBoxes.length;
  if (!numBoxes) {
    return;
  }
  // Return a random unoccupied box for new tile location
  return unoccupiedBoxes[Math.floor(Math.random() * numBoxes)];
}

function occupyBox(boxElement, boxValue) {
  boxElement.children[0].classList.add('occupied');
  boxElement.setAttribute("data-occupied", "true")
  boxElement.querySelector('.value').textContent = boxValue;
}

function updateBoardArrays (boxElement, boxValue) {
  const coords = boxElement.getAttribute("data-grid");
  previousBoard = currentBoard.map(row => (row.slice()));
  currentBoard[coords[4]][coords[1]] = boxValue;
}

function gameOver() {
  console.log('Game Over :(');
}

function moveTilesHorizontal(direction){
  for (let i=0; i<4; i++){
    currentBoard[i] = arrangeRow(currentBoard[i],direction);
  }
  updateGameBoard();
  generateRandomTile();
}

function arrangeRow(row, direction) {
  const sortedRow = sortRow(row, direction);
  return combineLikeValuesRow(sortedRow, direction);
}

function sortRow(row,direction='right') {
  const rowCopy = direction === 'left' ? row.slice().reverse() : row.slice();
  const sortedRow = [];
  const length = row.length-1;
  /* 
  Sort boxes with a value to the begining, and all unoccupied after
  ie [0,4,0,32] --> 'left':[4,32,0,0] - 'right':[32,4,0,0]
   */
  for (let value of rowCopy) {
    if(value > 0) {
      sortedRow.push(value);
    } else {
      sortedRow.unshift(0);
    }
  }
  return sortedRow.reverse();
  // return combineLikeValuesRow(sortedRow, direction);
}

function combineLikeValuesRow(row, direction) {
  /* 
  Combine non-zero value neighbors based on direction
  For 'right' combine with left adajcent of same value
  For 'left' combine with right adajcent of same value
  Values can only be combined once per move.
  ie. [4,0,4,8] --> 'left': [8,8,0,0] right: [0,0,8,8]
      [4,4,4,0] --> 'left': [8,4,0,0] right: [0,0,4,8]
  */
  const rowCopy = row.slice();
  let length = rowCopy.length-1;
  for(let i=0; i<length; i++) {
    if(rowCopy[i] === rowCopy[i+1]) {
      rowCopy[i+1] = rowCopy[i+1] * 2;
      rowCopy.splice(i, 1);
      rowCopy.push(0);
    }
  }
  return direction === 'right' ? rowCopy.reverse() : rowCopy;
}

function updateGameBoard() {
  clearGameBoard();
  fillOccupiedTiles();
}

function clearGameBoard() {
  const occupiedBoxes = document.querySelectorAll("[data-occupied = 'true']");
  for(const box of occupiedBoxes) {
    box.children[0].classList.remove('occupied');
    box.querySelector('.value').textContent = '';
    box.setAttribute('data-occupied', 'false');
  }
}

function fillOccupiedTiles() {
  for (let y=0; y<4; y++) {
    for(let x=0; x<4; x++) {
      const boxValue = currentBoard[y][x];
      if(boxValue > 0) {
        // get box element
        const box = document.querySelector(`[data-grid = 'x${x}-y${y}']`);
        occupyBox(box, boxValue);
      }
    }
  }
}


// TESTS
const test = [4,0,0,4]; // left:[8,0,0,0] - right[0,0,0,8]
const allZeros = [0,0,0,0] // left: [0,0,0,0] - right:[0,0,0,0]
const noMatches = [0,32,64,0] // left: [32,64,0,0] - right:[0,0,32,64]
const oneMatch = [0,4,4,4]  // left: [8,4,0,0] - right: [0,0,4,8]
const allMatches = [4,4,4,4] // left: [8,8,0,0] right: [0,0,8,8,]

