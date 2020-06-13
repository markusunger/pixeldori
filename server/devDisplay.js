/*
  terminal renderer for local development
*/

const DISPLAY_X = 16;
const DISPLAY_Y = 16;

// terminal characters for display
const symbols = {
  workCompleted: 'X',
  pauseCompleted: 'O',
  workCompletedStopped: '-',
  pauseCompletedStopped: '|',
  done: '<', 
  off: '.',
};

module.exports = {
  displayFrame: function displayFrame(frame) {
    for (let y = 0; y < DISPLAY_Y; y += 1) {
      let line = '';
      for (let x = 0; x < DISPLAY_X; x += 1) {
        const toDisplay = frame[y][x];
        line += toDisplay ? symbols[toDisplay] : symbols.off;
      }
      console.log(line);
    }
    console.log();
  },
  displayOff: function turnOff() {
    console.log('Turning Off...');
    return true;
  },
};
