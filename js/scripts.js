const controlBtns = document.querySelector('.controls-container');
const scoreboardBtns = document.querySelector('.scoreboard-buttons');

// === EVENT LISTENERS ===

// KEYPRESS
window.addEventListener('keydown', (e) => {
  const validKeyInputs = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
  }
  if(validKeyInputs[e.code]) {
    moveTiles(validKeyInputs[e.code]);
  }
})

// DIRECTIONAL ARROWS
controlBtns.addEventListener('click', e => {
  const validTargets = {
    'arrow-up': 'up',
    'arrow-down': 'down',
    'arrow-left': 'left',
    'arrow-right': 'right'
  }
  if(validTargets[e.target.id]) {
    moveTiles(validTargets[e.target.id]);
  }
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
    previousBoard = [];
    previouScore = 0;
    currentScore = 0;
    clearGameBoard();
  } else if (e.target.id = 'undo' || e.target.parentElement.id === 'undo'  ) {
    undoPreviousMove();
  }
});

function undoPreviousMove() {
  console.log('Currently under development... :)');
}
