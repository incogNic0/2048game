const TouchCtrl = (function () {
  let initialTouchPos;
  let lastTouchPos;
  
	// Handle the start of gestures
	function handleSwipeStart(evt) {
		evt.preventDefault();
		if (evt.touches && evt.touches.length > 1) {
			return;
		}
		if (window.PointerEvent) {
			evt.target.setPointerCapture(evt.pointerId);
		} else {
			// Add Mouse Listeners
			document.addEventListener("mousemove", handleSwipeMove, true);
			document.addEventListener("mouseup", handleSwipeEnd, true);
		}
		initialTouchPos = getGesturePointFromEvent(evt);
	}

	// Handle end gestures
	function handleSwipeEnd(evt) {
		evt.preventDefault();
		if (evt.touches && evt.touches.length > 0) {
			return;
		}
		// Remove Event Listeners
		if (window.PointerEvent) {
			evt.target.releasePointerCapture(evt.pointerId);
		} else {
			// Remove Mouse Listeners
			document.removeEventListener("mousemove", handleSwipeMove, true);
			document.removeEventListener("mouseup", handleSwipeEnd, true);
		}
		moveTilesSwipe();
		initialTouchPos = null;
	}

	function getGesturePointFromEvent(evt) {
		const point = {};
		if (evt.targetTouches) {
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
		if (!initialTouchPos) {
			return;
		}
		lastTouchPos = getGesturePointFromEvent(evt);
	}

	function moveTilesSwipe() {
		const horitonalSwipe = lastTouchPos.x - initialTouchPos.x;
		const verticalSwipe = lastTouchPos.y - initialTouchPos.y;
		if (Math.abs(horitonalSwipe) > Math.abs(verticalSwipe)) {
			if (horitonalSwipe > 0) {
				GameCtrl.moveTiles("right");
			} else {
				GameCtrl.moveTiles("left");
			}
		} else {
			if (verticalSwipe < 0) {
				GameCtrl.moveTiles("up");
			} else {
				GameCtrl.moveTiles("down");
			}
		}
	}
  return {
    handleSwipeStart, 
    handleSwipeEnd, 
    getGesturePointFromEvent, 
    handleSwipeMove,
    moveTilesSwipe
  }
})();
