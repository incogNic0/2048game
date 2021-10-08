const controlBtns = document.querySelector('.controls-container');
const scoreboardBtns = document.querySelector('.scoreboard-buttons');
const gameBoard = document.querySelector('.game-board');
let initialTouchPos;
let lastTouchPos;

// === EVENT LISTENERS ===
window.onload = function() {
  generateRandomTile();
}

// ====== Swipe Support ===============
// Check if pointer events are supported.
if (window.PointerEvent) {
  gameBoard.addEventListener('pointerdown', handleSwipeStart, true);
  gameBoard.addEventListener('pointermove', handleSwipeMove, true);
  gameBoard.addEventListener('pointerup', handleSwipeEnd, true);
  gameBoard.addEventListener('pointercancel', handleSwipeEnd, true);
} else {
  // Add Touch Listener
  gameBoard.addEventListener('touchstart', handleSwipeStart, true);
  gameBoard.addEventListener('touchmove', handleSwipeMove, true);
  gameBoard.addEventListener('touchend', handleSwipeEnd, true);
  gameBoard.addEventListener('touchcancel', handleSwipeEnd, true);
  
    // Add Mouse Listener
  gameBoard.addEventListener('mousedown', handleSwipeStart, true);
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
    moveTiles(validKeyInputs[e.code]);
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
    generateRandomTile();
  } else if (e.target.id = 'undo' || e.target.parentElement.id === 'undo'  ) {
    undoPreviousMove();
  }
});

function undoPreviousMove() {
  console.log('Currently under development... :)');
}

// Handle the start of gestures
function handleSwipeStart(evt) {
  evt.preventDefault();
  if(evt.touches && evt.touches.length > 1) {
    return;
  }
  if(window.PointerEvent) {
    evt.target.setPointerCapture(evt.pointerId);
  } else {
  // Add Mouse Listeners
    document.addEventListener('mousemove', handleSwipeMove, true);
    document.addEventListener('mouseup', handleSwipeEnd, true);
  }
  initialTouchPos = getGesturePointFromEvent(evt);
}

// Handle end gestures
function handleSwipeEnd(evt) {
  evt.preventDefault();
  if(evt.touches && evt.touches.length > 0) {
    return;
  }
  // Remove Event Listeners
  if (window.PointerEvent) {
    evt.target.releasePointerCapture(evt.pointerId);
  } else {
    // Remove Mouse Listeners
    document.removeEventListener('mousemove', handleSwipeMove, true);
    document.removeEventListener('mouseup', handleSwipeEnd, true);
  }
  moveTilesSwipe();
  initialTouchPos = null;
}

function getGesturePointFromEvent(evt) {
  var point = {};
  if(evt.targetTouches) {
    // Prefer Touch Events
    point.x = evt.targetTouches[0].clientX;
    point.y = evt.targetTouches[0].clientY;
  } else {
    // Either Mouse event or Pointer Event
    point.x = evt.clientX;
    point.y = evt.clientY;
  }
  return point;
}

function handleSwipeMove(evt) {
  evt.preventDefault();
  if(!initialTouchPos) {
    return;
  }
  lastTouchPos = getGesturePointFromEvent(evt);
}

function moveTilesSwipe(){
  const horitonalSwipe = lastTouchPos.x - initialTouchPos.x;
  const verticalSwipe = lastTouchPos.y - initialTouchPos.y;
  if(Math.abs(horitonalSwipe) > Math.abs(verticalSwipe)) {
    if(horitonalSwipe > 0) {
      moveTiles('right');
    } else {
      moveTiles('left');
    }
  } else {
    if(verticalSwipe < 0) {
      moveTiles('up');
    } else {
      moveTiles('down');
    }
  }
}