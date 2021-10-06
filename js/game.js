let currentBoard = [
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0]
]
let previousBoard = [];

let previouScore = 0;
let turnScore = 0;
let currentScore = 0;

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
  boxElement.querySelector('.value-box').classList.add(`bg-${boxValue}`);
}

function updateBoardArrays (boxElement, boxValue) {
  const coords = boxElement.getAttribute("data-grid");
  previousBoard = currentBoard.map(row => (row.slice()));
  currentBoard[coords[4]][coords[1]] = boxValue;
}

function gameOver() {
  console.log('Game Over :(');
}

// ========== Movement =====================
function moveTilesHorizontal(direction) {
  currentBoard.map((row, i) => {
    currentBoard[i] = arrangeTiles(row,direction);
  });
  updateGameBoard();
  updateScoreBoard();
  generateRandomTile();
}

function moveTilesVertical(direction) {
  const dir = direction === 'up' ? 'left' : 'right';
  for (let x=0; x<4; x++) {
    // Create an array of each currentBoard column
    const column = currentBoard.map((row => (row[x])));
    // Sort and Combine Same Column Values
    const sortedColumn = arrangeTiles(column, dir);
    // Update each currentBoard Column
    currentBoard.map((row, index) => {
      return row[x] = sortedColumn[index];
    });
  }
  updateGameBoard();
  updateScoreBoard();
  generateRandomTile();
}

function arrangeTiles(tilesArr, direction) {
  const sortedTiles = sortTiles(tilesArr, direction);
  return combineLikeValues(sortedTiles, direction);
}

function sortTiles(tilesArr,direction='right') {
  const tilesCopy = direction === 'left' ? tilesArr.slice().reverse() : tilesArr.slice();
  const sortedTiles = [];
  /* 
  Sort boxes with a value to the begining, and all unoccupied after
  ie [0,4,0,32] --> 'left':[4,32,0,0] - 'right':[32,4,0,0]
   */
  for (let value of tilesCopy) {
    if(value > 0) {
      sortedTiles.push(value);
    } else {
      sortedTiles.unshift(0);
    }
  }
  return sortedTiles.reverse();
}

function combineLikeValues(tilesArr, direction) {
  /* 
  Combine non-zero value neighbors based on direction
  For 'right' combine with left adajcent of same value
  For 'left' combine with right adajcent of same value
  Values can only be combined once per move.
  ie. [4,0,4,8] --> 'left': [8,8,0,0] right: [0,0,8,8]
      [4,4,4,0] --> 'left': [8,4,0,0] right: [0,0,4,8]
  */
  const tilesCopy = tilesArr.slice();
  let length = tilesCopy.length-1;
  for(let i=0; i<length; i++) {
    if(tilesCopy[i] === tilesCopy[i+1]) {
      turnScore += Number(tilesCopy[i]) * 2
      tilesCopy[i+1] = tilesCopy[i+1] * 2;
      tilesCopy.splice(i, 1);
      tilesCopy.push(0);
    }
  }
  return direction === 'right' ? tilesCopy.reverse() : tilesCopy;
}

function updateGameBoard() {
  clearGameBoard();
  fillOccupiedTiles();
}

function clearGameBoard() {
  const occupiedBoxes = document.querySelectorAll("[data-occupied = 'true']");
  for(const box of occupiedBoxes) {
    box.children[0].classList = 'value-box';
    box.querySelector('.value').textContent = '';
    box.setAttribute('data-occupied', 'false');
  }
}
function unoccupyBox(boxElement){
  boxElement.children[0].classList = 'value-box';
  boxElement.querySelector('.value').textContent = '';
  
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

function updateScoreBoard(){
  previouScore = currentScore;
  currentScore = previouScore + turnScore;
  document.querySelector('#currentScore').textContent = currentScore;
  turnScore = 0;
}


// Tests Horizontal
const test = [4,0,0,4]; // left:[8,0,0,0] - right[0,0,0,8]
const allZeros = [0,0,0,0] // left: [0,0,0,0] - right:[0,0,0,0]
const noMatches = [0,32,64,0] // left: [32,64,0,0] - right:[0,0,32,64]
const oneMatch = [0,4,4,4]  // left: [8,4,0,0] - right: [0,0,4,8]
const allMatches = [4,4,4,4] // left: [8,8,0,0] right: [0,0,8,8,]

// Tests Vertical
const vertTest = [
  [4,0,0,4],
  [0,0,32,4],
  [0,0,64,4],
  [4,0,0,0]
];

