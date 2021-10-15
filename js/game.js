let currentBoardUI = null;
let previousBoardUI = null;

let currentBoard = [
  [0,0,0,0],  // 'Occupied' === value > 0
  [0,0,0,0],
  [0,0,0,0],  // 'Unoccupied' === value = 0
  [0,0,0,0]
]
let tileMovements;
let previouScore = 0; // total game score prior to move 
let turnScore = 0; // points accrued from recent move   
let currentScore = 0; // total current game score
let bestScore = 0 // best score from all games -- not persistent yet --

//============ UI ==================

// ------------ New Box ---------------
function generateRandomTile() {
	const value = getValue(); // returns random value of 2 or 4
  // Select random unoccupied box for new tile location
	const boxGridPos = selectRandomBox(); // returns `x${xPos}-y${yPos}`
  if(boxGridPos) {
    occupyBox(boxGridPos, value); // Update UI to display new tile
    // Update currentBoard array with new value at index of tile's UI grid position
    currentBoard[boxGridPos[4]][boxGridPos[1]] = value;
  } else {
    // All boxes are filled and no valid tile combinations left
    gameOver(); // -- currently never runs ---
  }
}

// Sets random value for new tile (2 or 4)
function getValue() {
	const nums = [2, 4];
	return nums[Math.round(Math.random() * 1)];
}

// Randomly selects location of new tile from empty grid-boxes
function selectRandomBox() {
  // Get all unoccupied boxes
  const unoccupiedBoxes = document.querySelectorAll('[data-occupied="false"]');
  const numBoxes = unoccupiedBoxes.length;
  if (!numBoxes) return; // Game over
  // Return random unoccupied box grid posistion
  return unoccupiedBoxes[Math.floor(Math.random() * numBoxes)].getAttribute('data-grid');
}


// ----------- Display Tiles -----------------------------
function occupyBox(gridPos, tileValue) {
  const rowBox = document.querySelector(`[data-grid = ${gridPos}]`);
  updateValueBox(rowBox.children[0], tileValue);
  rowBox.setAttribute('data-occupied', 'true');
}

function updateValueBox(valueBoxElement, value) {
  if(value > 999) {
    valueBoxElement.classList.add('value-four-digit')
  } else if(value > 99) {
    valueBoxElement.classList.add('value-three-digit');
  }
  valueBoxElement.textContent = value;
  valueBoxElement.classList.add('occupied', `bg-${value}`);
}

// Puts tiles in corresponding UI grid positions
function fillOccupiedTiles() {
  // Loops through currentBoard array
  for (let y=0; y<4; y++) {
    for(let x=0; x<4; x++) {
      // Create tile in grid-box if value exists, or leave empty
      if(currentBoard[y][x] > 0) {
        occupyBox(`x${x}-y${y}`, currentBoard[y][x])
      }
    }
  }
}

// Clears and resets all UI tiles
function clearGameBoard() {
  // Get all occupied boxes
  const occupiedBoxes = document.querySelectorAll("[data-occupied = 'true']");
  // Resets each occupied box
  for(const box of occupiedBoxes) {
    const valueBox = box.children[0]
    // Remove 'occupy' and 'bg-###' classes
    valueBox.classList = 'value-box';
    // Remove Value from box
    valueBox.textContent = ''
    // Set Box to unoccuped
    box.setAttribute('data-occupied', 'false');
  }
}

// Clears UI and then refills all occupied tiles (values !== 0)
function updateGameBoard() {
  clearGameBoard();
  fillOccupiedTiles();
}

// --------------- Game State ----------------
// Get grid positions and values of all row-box elements
function getBoardUIState() {
  const boardState = {};
  const allRowBoxes = document.querySelectorAll('.row-box');
  for (const rowBox of allRowBoxes) {
    const gridPos = rowBox.getAttribute('data-grid');
    const value = Number(rowBox.children[0].textContent);
    boardState[gridPos] = {
      value,
      isOccupied: function() {return this.value > 0}
    }
  }
  return boardState;
}

// Update scoreboard UI
function updateScoreBoard(undo=false){
  if(undo === 'undo' || undo === true) {
    currentScore = previouScore;
  } else {
    previouScore = currentScore;
    currentScore = previouScore + turnScore;
  }
  turnScore = 0;
  document.querySelector('#current-score').textContent = currentScore;
  if(currentScore > bestScore) {
    bestScore = currentScore;
    document.querySelector('#best-score').textContent = bestScore;
  }
}

function gameOver() {
  console.log('Game Over :(');
}

// Undo previous move only
function undoMove() {
  clearGameBoard();
  for (const gridPos in previousBoardUI) {
    if(previousBoardUI[gridPos].value > 0) {
      occupyBox(gridPos, previousBoardUI[gridPos].value);
    }
  }
  currentBoardUI = getBoardUIState()
  for (const gridPos in currentBoardUI) {
    currentBoard[gridPos[4]][gridPos[1]] = currentBoardUI[gridPos].value;
  }
  updateScoreBoard('undo');
}

// ========== Movement =====================
function moveTiles(direction) {
  // Clear prior tile movements, and track new movements
  tileMovements = [];
  // Get board state prior to move to ensure it changes afterwards
  previousBoardUI = getBoardUIState();
  if (direction === 'up' || direction === 'down') {
    moveTilesVertically(direction)
  } else {
    moveTilesHorizontally(direction);
  }
  // If no tiles h change positions do nothing
  if(!boardChanged()) return; // do nothing if move won't change board
  updateGameBoard();
  updateScoreBoard();
  // setTimeout(generateRandomTile, 500);
  generateRandomTile();
}

// Horizontal Move
function moveTilesHorizontally(direction) {
  const lenBoard = currentBoard.length;
  const col = direction === 'right' ? 3 : 0;
  for (let row=0; row<lenBoard; row++) {
    sortRow(direction, col, row);
  }
}

// Sorts and combines specific matching tiles in a row
function sortRow(direction, colIndex=0, rowIndex=0) {
  // Find first occupied box index (not including current index)
  const occupiedIndex = findFirstOccupiedBox(direction, colIndex, rowIndex); // returns -1 if none
  // Case: end of row or all boxes are unoccupied
  if (occupiedIndex < 0 ) return;
  // Case: current box is unoccupied
  if(currentBoard[rowIndex][colIndex] === 0) {
    // Set value of current box to value of first occupied box
    currentBoard[rowIndex][colIndex] = currentBoard[rowIndex][occupiedIndex];
    // Set previously occupied box to unoccupied
    currentBoard[rowIndex][occupiedIndex] = 0;
    // Record tile movement changes for animation
    tileMovements.push(
      trackTileMovement(direction, colIndex, rowIndex, occupiedIndex)
    );
    // Rerun at current position and check if next tile value matches
    return sortRow(direction, colIndex, rowIndex);
  }
  // Case: current box is occupied and next occupied box's value matches
  if (currentBoard[rowIndex][colIndex] === currentBoard[rowIndex][occupiedIndex]) {
    // Combine tiles and values at current box position
    currentBoard[rowIndex][colIndex] *= 2;
    // Set previously occupied box to unoccupied
    currentBoard[rowIndex][occupiedIndex] = 0;
    // Add points to turn score
    turnScore += currentBoard[rowIndex][colIndex];
    // Record tile movement for animation
    tileMovements.push(
      trackTileMovement(direction, colIndex, rowIndex, occupiedIndex)
    );
  }
  // Case: current box is occupied and next box's value is non-matching
  if(direction === 'right') return sortRow(direction, colIndex-1, rowIndex);
  return sortRow(direction, colIndex+1, rowIndex); // move on to next col in row
}


// Vertical Movement
function moveTilesVertically(direction) {
  const numColumns = currentBoard.length;
  const row = direction === 'down' ? 3 : 0;
  for (let col=0; col<numColumns; col++) {
    sortColumn(direction, col, row);
  }
}

function sortColumn(direction, colIndex=0, rowIndex=0) {
  // Get index of first occupied box relative to current box (not inclusive)
  const occupiedIndex = findFirstOccupiedBox(direction, colIndex, rowIndex); // returns -1 if none
  // If no occupied boxes lest in current column move on to next column 
  if(occupiedIndex < 0) return;
  // Case: current box is unoccupied
  if(currentBoard[rowIndex][colIndex] === 0) {
    // Set value of current box to value of first occupied box
    currentBoard[rowIndex][colIndex] = currentBoard[occupiedIndex][colIndex];
    // Set previously occupied box to 0 (unoccupied)
    currentBoard[occupiedIndex][colIndex] = 0;
    // Record tile movement for animation
    tileMovements.push(
      trackTileMovement(direction, colIndex, rowIndex, occupiedIndex)
    );  
    // Rerun at current position and check if next occupied box has matching value
    return sortColumn(direction, colIndex, rowIndex);
  }
  // Case: current box is occupied and next box's value is the same
  if(currentBoard[rowIndex][colIndex] === currentBoard[occupiedIndex][colIndex]) {
    // Double current box's value
    currentBoard[rowIndex][colIndex] *= 2
    // Set next occupied box index to unoccupied
    currentBoard[occupiedIndex][colIndex] = 0;
    // Add points to turn score
    turnScore += currentBoard[rowIndex][colIndex];
    // Record tile movement for animation
    tileMovements.push(
      trackTileMovement(direction, colIndex, rowIndex, occupiedIndex)
    );
  }
  // Case: current box is occupied and next box's value is non-matching
  if(direction === 'down') return sortColumn(direction, colIndex, rowIndex-1);
  return sortColumn(direction, colIndex, rowIndex+1); // move on to next row in col
}

// ============ Utilities ==============

// Checks if move changes board to determine if move is valid or not
function boardChanged() {
  for (let y=0, len = currentBoard.length; y<len; y++) {
    for(let x=0, len = currentBoard[y].length; x<len; x++) {
      if (currentBoard[y][x] !== previousBoardUI[`x${x}-y${y}`].value){
        return true;
      }
    }
  }
  return false;
}

// Finds first occupied box's index based on direction or -1
function findFirstOccupiedBox(direction, colIndex, rowIndex) {
  const directions = {
    left: true,
    right: true,
    up: true,
    down: true
  }
  // Throw error if invalid direction inputed
  if(!directions[direction]) throw 'Not a valid direction'
  // One index is constant thru loop
  const lenBoard = currentBoard.length;
  if(direction === 'left') {
    for (let x = colIndex+1; x < lenBoard; x++ ) {
      if(currentBoard[rowIndex][x] > 0) return x;
    }
  } else if(direction === 'right') {
    for(let x = colIndex-1; x > -1; x--) {
      if(currentBoard[rowIndex][x] > 0) return x;
    }
  } else if(direction === 'up') {
    for(let y = rowIndex + 1; y < lenBoard; y++) {
      if(currentBoard[y][colIndex] > 0) return y;
    }
  } else if(direction === 'down') {
    for(let y = rowIndex-1; y > -1; y--) {
      if(currentBoard[y][colIndex] > 0) return y;
    }
  }
  return -1; // returns if no boxes with a value were found
}

function trackTileMovement(direction, colIndex, rowIndex, occupiedIndex) {
  let originalPos;
  let previousValue;
  if(direction === 'left' || direction === 'right') {
    originalPos = `x${occupiedIndex}-y${rowIndex}`;
    previousValue = previousBoardUI[`x${occupiedIndex}-y${rowIndex}`].value;
  } else {
    originalPos = `x${colIndex}-y${occupiedIndex}`;
    previousValue = previousBoardUI[`x${occupiedIndex}-y${rowIndex}`].value;
  }
  return {
    direction,
    originalPos,
    previousValue,
    newPos: `x${colIndex}-y${rowIndex}`,
    newValue: currentBoard[rowIndex][colIndex],
  }
}
