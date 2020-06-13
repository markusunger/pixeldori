/*
  frameRenderer provides a method to create a frame buffer array from a given
  timer state by calculating what each buffer field should be set to 

  the frame buffer is completely derived from the current state of the timer,
  depending on the state type itself (active, stopped, offline) and the progress
  percentage for active timer states.
*/

const FRAME_X = 16;
const FRAME_Y = 16;

module.exports = (function frameRenderer() {
  const createBuffer = function createBuffer() {
    return [...Array(FRAME_Y)].map(() => [...Array(FRAME_X).fill(undefined)]);
  };

  const generateFrame = function generateFrame(cb) {
    const buffer = createBuffer();
    for (let y = 0; y < FRAME_Y; y += 1) {
      for (let x = 0; x < FRAME_X; x += 1) {
        buffer[y][x] = cb(x, y);
      }
    }
    return buffer;
  }

  return function render({ timerState, progress }) {
    switch (timerState) {
      // generate empty screen for offline state
      case 'offline':
        return generateFrame(() => null);

      // generate progress frame for active or stopped work/pause
      // fall-through case statements because they are all generated
      // the same (so far)
      case 'stoppedPause':
      case 'activePause':
      case 'stoppedWork':
      case 'activeWork': {
        const toFill = parseInt((FRAME_X * FRAME_Y * progress) / 100, 10);
        return generateFrame((x, y) => {
          if ((y * FRAME_X) + x <= toFill) {
            switch (timerState) {
              case 'activeWork':
                return 'workCompleted';
              case 'stoppedWork':
                return 'workCompletedStopped';
              case 'activePause':
                return 'pauseCompleted';
              case 'stoppedPause':
                return 'pauseCompletedStopped';
              default:
                break;
            }
          } else {
            return null;
          }
        });
      }

      // generate screen for completed work or pause
      // again with a fallthrough case statement
      case 'completedWork':
      case 'completedPause': {
        return generateFrame(() => {
          return 'done';
        });
      } 
      default:
        break;
    }
  }
})();
