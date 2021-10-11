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
// let previousBoard = [];

// Score prior to most recent move.  Allows 'undo' of most recent move only
let previouScore = 0;
//  Add to previous score for new current. Needed for 'undo' functionality
let turnScore = 0;
// Score after move
let currentScore = 0;

//============ UI ==================
function generateRandomTile() {
  // Generate random value (2 or 4) for new box
	const value = getValue();
  // Select random box for new tile location
	const box = selectRandomBox();
  if(box) {
    // Update UI
    occupyBox(box,value);
    // Update currentBoard and previousBoard values
    // testCurrent = document.querySelectorAll('.occupied');
    currentBoardUI = getBoardUIState();
    updateBoardArrayTest();
    // updateBoardArrays(box, value);  ---------
  } else {
    // All boxes are filled and no valid tile combinations left
    gameOver();
  }
}


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

function gameOver() {
  console.log('Game Over :(');
}

// Clears UI and then refills all occupied tiles (values !== 0)
function updateGameBoard() {
  clearGameBoard();
  fillOccupiedTiles();
}

/// Testing
function undoMove() {
  clearGameBoard();
  for (const tile of previousBoardUI) {
    if(tile.value > 0) {
      occupyBoxTest(tile.gridPos, tile.value);
    }
  }
  currentBoardUI = getBoardUIState();
  updateBoardArrayTest();
  updateScoreBoard('undo');
}

/// Testing
function occupyBoxTest(gridPos, tileValue) {
  const rowBox = document.querySelector(`[data-grid = ${gridPos}]`);
  rowBox.setAttribute('data-occupied', 'true');
  rowBox.children[0].textContent = tileValue;
  rowBox.children[0].classList.add('occupied', `bg-${tileValue}`);
}

/// Testing
function getBoardUIState() {
  const boardState = [];
  const allRowBoxes = document.querySelectorAll('.row-box');
  for (const rowBox of allRowBoxes) {
    const boxValue = rowBox.children[0].textContent;
    const rowBoxState = {
      gridPos: rowBox.getAttribute('data-grid'),
      value: !boxValue ? 0 : boxValue
    }
    boardState.push(rowBoxState); 
  }
  return boardState;
}

//// Testing
function updateBoardArrayTest () {
  for (const rowBox of currentBoardUI) {
    currentBoard[rowBox.gridPos[4]][rowBox.gridPos[1]] = rowBox.value;
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

// ========== Movement =====================
function moveTiles(direction) {
  // copy currentBoard to see if there's any change after move
  // if there's no changes move is not allowed
  previousBoardUI = getBoardUIState();
  const tempCurrent = currentBoard.map(row => (row.slice()));
  if (direction === 'up' || direction === 'down') {
    moveTilesVertically(direction)
    if(!boardChanged(tempCurrent,currentBoard))
      return;
  } else {
    moveTilesHorizontally(direction);
    if(!boardChanged(tempCurrent,currentBoard))
      return;
  }
  updateGameBoard();
  updateScoreBoard();
  generateRandomTile();
  console.log();
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


// ============ Utilities ==============

// Updates previousBoard for 'undo' purposes and updates currentBoard with new random tile value
function updateBoardArrays (boxElement, boxValue) {
  const coords = boxElement.getAttribute("data-grid");
  // Copy currentBoard prior to new tile
  previousBoard = currentBoard.map(row => (row.slice()));
  // Update currentBoard to include new random tile position and value
  currentBoard[coords[4]][coords[1]] = boxValue;
}

// Checks if move changes board to determine if move is valid or not
function boardChanged(board1,board2) {
  for (let y=0, length = board1.length; y<length; y++) {
    for(let x=0, length = board1[y].length; x< length; x++) {
      if (board1[y][x] !== board2[y][x])
        return true;
    }
  }
  return false;
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

