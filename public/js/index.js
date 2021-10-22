const controlBtns = document.querySelector('.controls-container');
const scoreboardBtns = document.querySelector('.scoreboard-buttons');
const gameBoard = document.querySelector('.game-board');
const root = document.documentElement;

// set mobile height
root.style.setProperty('--mobile-height', gameBoard.getBoundingClientRect().width + 'px');
// update height and box grid spacing 
window.addEventListener('resize', () => {
  root.style.setProperty('--mobile-height', gameBoard.getBoundingClientRect().width + 'px');
})

// Initial Game
GameCtrl.newGame();

// ====== Swipe Support ===============
// Check if pointer events are supported.
if (window.PointerEvent) {
  gameBoard.addEventListener('pointerdown', TouchCtrl.handleSwipeStart, true);
  gameBoard.addEventListener('pointermove', TouchCtrl.handleSwipeMove, true);
  gameBoard.addEventListener('pointerup', TouchCtrl.handleSwipeEnd, true);
  gameBoard.addEventListener('pointercancel', TouchCtrl.handleSwipeEnd, true);
} else {
  // Add Touch Listener
  gameBoard.addEventListener('touchstart', TouchCtrl.handleSwipeStart, true);
  gameBoard.addEventListener('touchmove', TouchCtrl.handleSwipeMove, true);
  gameBoard.addEventListener('touchend', TouchCtrl.handleSwipeEnd, true);
  gameBoard.addEventListener('touchcancel', TouchCtrl.handleSwipeEnd, true);
  
    // Add Mouse Listener
  gameBoard.addEventListener('mousedown', TouchCtrl.handleSwipeStart, true);
}


// KEYPRESS
window.addEventListener('keydown', (e) => {
  const validKeyInputs = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
  }
  if(validKeyInputs[e.code]) {
    GameCtrl.moveTiles(validKeyInputs[e.code]);
  }
})

// NEW GAME / UNDO
scoreboardBtns.addEventListener('click', e => {
  if(e.target.id === 'new-game' || e.target.parentElement.id === 'new-game') {
    GameCtrl.newGame();
  } else if (e.target.id = 'undo' || e.target.parentElement.id === 'undo'  ) {
    GameCtrl.undoMove();
  }
});



