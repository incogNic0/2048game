// 'Occupied' tile === value > 0
// 'Unoccupied' tile === value=0
let currentBoardUI = null;
let previousBoardUI = null;

let currentBoard = [
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0]
]

// Score prior to most recent move.  Allows 'undo' of most recent move only
let previouScore = 0;
//  Add to previous score for new current. Needed for 'undo' functionality
let turnScore = 0;
// Score after move
let currentScore = 0;

//============ UI ==================

// ------------ New Box ---------------
function generateRandomTile() {
  // Generate random value (2 or 4) for new box
	const value = getValue();
  // Select random box for new tile location
	const box = selectRandomBox();
  if(box) {
    // Update UI
    occupyBox(box,value);
    // Update currentBoard and previousBoard values
    currentBoardUI = getBoardUIState();
    updateCurrentBoardArray()
  } else {
    // All boxes are filled and no valid tile combinations left
    gameOver();
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
  if (!numBoxes)
    // Game Over
    return;
  // Return a random unoccupied box
  return unoccupiedBoxes[Math.floor(Math.random() * numBoxes)];
}


// ----------- Display Tiles -----------------------------
// Displays tile value and unique bg color for each value
function occupyBox(boxElement, boxValue) {
  const valueBox = boxElement.children[0];
  // const valueText = boxElement.querySelector('.value');
  valueBox.textContent = boxValue
  // Use smaller fonts for larger values
  if(boxValue > 999)
    valueBox.classList.add('value-four-digit');
  if(boxValue > 99)
    valueBox.classList.add('value-three-digit');
  // Set unique bg color depending on tile value
  valueBox.classList.add('occupied', `bg-${boxValue}`);
  boxElement.setAttribute("data-occupied", "true")
}

/// Testing
function occupyBoxTest(gridPos, tileValue) {
  const rowBox = document.querySelector(`[data-grid = ${gridPos}]`);
  rowBox.setAttribute('data-occupied', 'true');
  rowBox.children[0].textContent = tileValue;
  rowBox.children[0].classList.add('occupied', `bg-${tileValue}`);
}

// Puts tiles in corresponding UI grid positions
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

function updateCurrentBoardArray() {
  for (const gridPos in currentBoardUI) {
    currentBoard[gridPos[4]][gridPos[1]] = currentBoardUI[gridPos].value;
  }
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
  document.querySelector('#currentScore').textContent = currentScore;
}

function gameOver() {
  console.log('Game Over :(');
}

// Undo previous move only
function undoMove() {
  clearGameBoard();
  for (const gridPos in previousBoardUI) {
    if(previousBoardUI[gridPos].value > 0) {
      occupyBoxTest(gridPos, previousBoardUI[gridPos].value);
    }
  }
  currentBoardUI = getBoardUIState()
  updateCurrentBoardArray()
  updateScoreBoard('undo');
}

// ========== Movement =====================
function moveTiles(direction) {
  // copy currentBoard to see if there's any change after move
  // if there's no changes move is not allowed
  previousBoardUI = getBoardUIState();
  if (direction === 'up' || direction === 'down') {
    moveTilesVertically(direction)
  } else {
    moveTilesHorizontally(direction);
  }
  if(!boardChanged()) return;
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