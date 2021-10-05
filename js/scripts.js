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
      moveTilesHorizontal('left');
      break;
    case 'ArrowRight':
      moveTilesHorizontal('right');
    default:
      break;
    updateGameBoard();
    generateRandomTile();
  }

});

// DIRECTIONAL ARROWS
controlBtns.addEventListener('click', e => {
  console.log(e.target.id);
})

// NEW GAME / UNDO
scoreboardBtns.addEventListener('click', e => {
  if(e.target.id === 'new-game' || e.target.parentElement.id === 'new-game') {
    currentBoard = [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ]
    clearGameBoard();
  } else if (e.target.id = 'undo' || e.target.parentElement.id === 'undo'  ) {
    updateGameBoard();
  }
});


function moveUp() {
  console.log('Move up!');
};

function moveDown() {
  console.log('Move down!');
};