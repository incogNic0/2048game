// 'Occupied' tile === value > 0
// 'Unoccupied' tile === value=0

let currentBoard = [
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0]
]
let previousBoard = [];

// Score prior to most recent move.  Allows 'undo' of most recent move only
let previouScore = 0;
//  Add to previous score for new current. Needed for 'undo' functionality
let turnScore = 0;
// Score after move
let currentScore = 0;

function generateRandomTile() {
  // Generate random value (2 or 4) for new box
	const value = getValue();
  // Select random box for new tile location
	const box = selectRandomBox();
  if(box) {
    // Update UI
    occupyBox(box,value);
    // Update currentBoard and previousBoard values
    updateBoardArrays(box, value);
  } else {
    // All boxes are filled and no valid tile combining left
    gameOver();
  }
}

// New tiles have a starting value of 2 or 4
function getValue() {
	const nums = [2, 4];
	return nums[Math.round(Math.random() * 1)];
}
// Randomly select location of new tile from empty grid-boxes
function selectRandomBox() {
  // Get all unoccupied boxes
  const unoccupiedBoxes = document.querySelectorAll('[data-occupied="false"]');
  const numBoxes = unoccupiedBoxes.length;
  if (!numBoxes) {
    // Game Over
    return;
  }
  // Return a random unoccupied box
  return unoccupiedBoxes[Math.floor(Math.random() * numBoxes)];
}

function occupyBox(boxElement, boxValue) {
  const valueText = boxElement.querySelector('.value');
  valueText.textContent = boxValue
  // Use smaller fonts for larger values
  if(boxValue > 999) {
    valueText.classList.add('value-four-digit');
  } else if(boxValue > 99) {
    valueText.classList.add('value-three-digit');
  }
  boxElement.children[0].classList.add('occupied');
  boxElement.setAttribute("data-occupied", "true")
  // Set unique bg color depending on tile value
  boxElement.querySelector('.value-box').classList.add(`bg-${boxValue}`);
}

function updateBoardArrays (boxElement, boxValue) {
  const coords = boxElement.getAttribute("data-grid");
  // Copy currentBoard prior to new tile
  previousBoard = currentBoard.map(row => (row.slice()));
  // Update currentBoard to include new random tile position and value
  currentBoard[coords[4]][coords[1]] = boxValue;
}

function gameOver() {
  console.log('Game Over :(');
}

// ========== Movement =====================
function moveTiles(direction) {
  if (direction === 'up' || direction === 'down') {
    moveTilesVertically(direction)
  } else {
    moveTilesHorizontally(direction);
  }
  updateGameBoard();
  updateScoreBoard();
  generateRandomTile(); 
}
// Tiles vorizontal movement
function moveTilesHorizontally(direction) {
  currentBoard.map((row, i) => {
    currentBoard[i] = arrangeTiles(row,direction);
  });
}
// Tiles vertical movement
function moveTilesVertically(direction) {
  const dir = direction === 'up' ? 'left' : 'right';
  const numColumns = currentBoard[0].length;
  // Loop through each column
  for (let x=0; x<numColumns; x++) {
    // Create an array of the values from each row of the column
    const column = currentBoard.map((row => (row[x])));
    // Sort and combine same adjacent values based on direction
    const sortedColumn = arrangeTiles(column, dir);
    // Update each currentBoard Column
    currentBoard.map((row, index) => {
      return row[x] = sortedColumn[index];
    });
  }
}
// Sort and combine adjacent like valued tiles based on direction
function arrangeTiles(tilesArr, direction) {
  const sortedTiles = sortTiles(tilesArr, direction);
  return combineLikeValues(sortedTiles, direction);
}
// Sort tiles prior to combining
function sortTiles(tilesArr,direction) {
  const tilesCopy = direction === 'left' ? tilesArr.slice().reverse() : tilesArr.slice();
  const sortedTiles = [];
  for (const value of tilesCopy) {
    if(value === 0) {
      sortedTiles.push(0);
    } else {
      sortedTiles.unshift(value);
    }
  }
  /* 
  Sorts occupied boxes to the begining (keeping order), and all unoccupied after
  ie. [0,4,0,32] --> 'left':[4,32,0,0] - 'right':[32,4,0,0]**
    **'right' is reversed to use same combining function 
  */
  return sortedTiles;
}

// Combine adjacent tiles based on same values and directional input
function combineLikeValues(tilesArr, direction) {
  /* 
  For 'right' combine with left adajcent of same value**
  For 'left' combine with right adajcent of same value
  Values can only be combined once per move.
  ie. [4,0,4,8] --> 'left': [8,8,0,0] right: [0,0,8,8]
      [4,4,4,0] --> 'left': [8,4,0,0] right: [0,0,4,8] 
  */
  const tilesCopy = tilesArr.slice();
  let length = tilesCopy.length-1;
  for(let i=0; i<length; i++) {
    // If tile value === adjacent tile value, combine tiles and values
    if(tilesCopy[i] === tilesCopy[i+1]) {
      // track total turn score
      turnScore += Number(tilesCopy[i]) * 2
      // keep one tile and double it's value
      tilesCopy[i+1] = tilesCopy[i+1] * 2;
      // remove a tile
      tilesCopy.splice(i, 1);
      // Add unoccupied value for removed tile
      tilesCopy.push(0);
    }
  }
  // **'right' was inputed reversed and is returned to its correct order
  return direction === 'right' ? tilesCopy.reverse() : tilesCopy;
}

// Clears UI and then refills all occupied tiles (values !== 0)
function updateGameBoard() {
  clearGameBoard();
  fillOccupiedTiles();
}
// Clears all UI tiles
function clearGameBoard() {
  // Get all occupied boxes
  const occupiedBoxes = document.querySelectorAll("[data-occupied = 'true']");
  // Resets each occupied box
  for(const box of occupiedBoxes) {
    const valueDisplay = box.children[0]
    // Remove 'occupy' and 'bg-###' classes
    valueDisplay.classList = 'value-box';
    // Remove Value from box
    valueDisplay.children[0].textContent = ''
    // Remove classes that reduce font size for larger values
    valueDisplay.children[0].classList = 'value'
    // Set Box to unoccuped
    box.setAttribute('data-occupied', 'false');
  }
}
// Put tiles in corresponding UI grid positions
function fillOccupiedTiles() {
  // Loops through currentBoard array
  for (let y=0; y<4; y++) {
    for(let x=0; x<4; x++) {
      // Creates tile in grid-box if value exists, or leaves empty
      const boxValue = currentBoard[y][x];
      if(boxValue > 0) {
        const box = document.querySelector(`[data-grid = 'x${x}-y${y}']`);
        occupyBox(box, boxValue);
      }
    }
  }
}
// Score keeping
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

