const currentBoard = {
  row0: [0,0,0,0],
  row1: [0,0,0,0],
  row2: [0,0,0,0],
  row3: [0,0,0,0]
}

let previousBoard;

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
  const coords = boxElement.getAttribute("data-grid").split('-');
  previousBoard = JSON.parse(JSON.stringify(currentBoard));
  currentBoard[coords[0]][coords[1]] = boxValue;
}

function gameOver() {
  console.log('Game Over :(');
}

