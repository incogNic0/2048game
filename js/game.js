let currentBoardUI = null;
let previousBoardUI = null;

let currentBoard = [
  [0,0,0,0],  // 'Occupied' === value > 0
  [0,0,0,0],
  [0,0,0,0],  // 'Unoccupied' === value = 0
  [0,0,0,0]
]

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
    // valueDisplay.classList.add('slide-right');
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
  generateRandomTile();
}

// Manages the correct order for rows to be sorted and returned
function arrangeRow(rowArr, direction) {
  //'right' row needs to be reversed to sort and combine values correctly
  const row = direction === 'right' ? rowArr.reverse() : rowArr;
  // Reverse 'right' row back to original order and return sorted row
  return direction === 'right' ? sortBoxes(row).reverse() : sortBoxes(row);
}

// Sorts and combines specific matching tiles in a row
function sortBoxes(row, index=0) {
  // Find first occupied box index (not including current index)
  const nextOccupiedIndex = row.slice(index+1).findIndex(elem => elem > 0);
  // Case: end of row or all boxes are unoccupied
  if(nextOccupiedIndex === -1) return row; // End and return sorted row
  // Case: current box is unoccupied
  if(row[index] === 0) {
    // Move first occupied box to current box index;
    row[index] = row[nextOccupiedIndex+index+1];
    row[nextOccupiedIndex+index+1] = 0; // tile has been moved. set box to unoccupied
    // rerun at current index in case a matching adjacent tile remains
    return sortBoxes(row,index);
  // Case: current box is occupied and next occupied box's value matches
  }else if(row[index] > 0 && row[nextOccupiedIndex+index+1] === row[index]) {
    row[index] = row[index] * 2;  // Tiles combine doubling value of current box
    row[nextOccupiedIndex+index+1] = 0; // tile has been moved. set box to unoccupied
    turnScore += row[index];
  }
  return sortBoxes(row, index+1); // move on to next box
}


// Tiles vorizontal movement
function moveTilesHorizontally(direction) {
  currentBoard.map((row, y) => {
    // Arrage row and update currentBoard
    currentBoard[y] = arrangeRow(row,direction);
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
    const sortedColumn = arrangeRow(column, dir);
    // Update each currentBoard Column
    currentBoard.map((row, index) => {
      return row[x] = sortedColumn[index];
    });
  }
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