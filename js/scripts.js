const controlBtns = document.querySelector('.controls-container');
const scoreboardBtns = document.querySelector('.scoreboard-buttons');

// === EVENT LISTENERS ===

// KEYPRESS
window.addEventListener('keydown', (e) => {
  switch(e.code) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
    default:
      break;
  }
});

// DIRECTIONAL ARROWS
controlBtns.addEventListener('click', e => {
  console.log(e.target.id);
})

// NEW GAME / UNDO
scoreboardBtns.addEventListener('click', e => {
  if(e.target.id === 'new-game' || e.target.parentElement.id === 'new-game') {
    generateRandomTile();
  } else if (e.target.id = 'undo' || e.target.parentElement.id === 'undo'  ) {
    console.log('undo!');
  }
});

function moveRight() {
  console.log('Move right!');
};

function moveLeft() {
  console.log('Move left!');
};

function moveUp() {
  console.log('Move up!');
};

function moveDown() {
  console.log('Move down!');
};