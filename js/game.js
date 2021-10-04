function newRandomTile() {
	const value = getValue(); // Generate random value (2 or 4) for new box
	displayNewTile(value);
}

function getValue() {
	const nums = [2, 4];
	return nums[Math.round(Math.random() * 1)];
}

function displayNewTile(value) {
  // Get all unoccupied boxes
	const unoccupiedBoxes = document.querySelectorAll('[data-occupied="false"]');
  const numBoxes = unoccupiedBoxes.length;
  if (numBoxes) {
    // Select a random unoccupied box for new tile location
    const box = unoccupiedBoxes[Math.floor(Math.random() * numBoxes)];
    occupyBox(box,value); // Set tile value, display, and mark as occupied
  } else {
    return gameOver();
  }
}

function occupyBox(boxElement, boxValue) {
  boxElement.children[0].classList.add('occupied');
  boxElement.setAttribute("data-occupied", "true")
  boxElement.querySelector('.value').textContent = boxValue;
}

function gameOver() {
  console.log('Game Over :(');
}

