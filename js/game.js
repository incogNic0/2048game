const currentBoard = [
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
  console.log(currentBoard);
}

function gameOver() {
  console.log('Game Over :(');
}

function moveTilesHorizontal(direction){
  const moveTiles = direction === 'left' ? moveRowLeft : moveRowRight;
  for (let i=0; i<4; i++){
    currentBoard[i] = moveTiles(currentBoard[i]);
  }
  console.log(currentBoard);
}

function moveRowRight(arr) {
  const row = combineLikeNeighborsRow(arr, 'right');
  const output = []
  for (let box of row) {
    if(box > 0) {
      output.push(box);
    } else {
      output.unshift(0);
    }
  }
  return output;
}

function moveRowLeft(arr) {
  const row = combineLikeNeighborsRow(arr, 'left');
  const output = [];
  for (let box of row) {
    if(box > 0) {
      output.unshift(box);
    } else {
      output.push(0);
    }
  }
  return output;
}

function combineLikeNeighborsRow(arr, direction='right') {
  // For direction of right, combine left side neighbor.
  // For direction of left, combine right side neighbor.
  const copyArr = direction === 'left' ? arr.slice().reverse() : arr.slice();
  const output = [];
  let i = copyArr.length-1;
  while (i>0) {
    if(copyArr[i] === copyArr[i-1]) {
      output.push(copyArr[i]*2);
      copyArr[i-1] = 0;
    } else {
      output.push(copyArr[i])
    }
    i--;
  }
  output.push(copyArr[0])
  return output.reverse();
}

const test = [4,4,4,0];
const allZeros = [0,0,0,0]
const noMatches = [0,32,64,0]
const oneMatch = [0,4,4,4]
const allMatches = [4,4,4,4]
