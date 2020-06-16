const UnicornHD = require('unicornhat-hd');

let unicorn;
try {
  unicorn = new UnicornHD('/dev/spidev0.0');
} catch (err) {
  throw(new Error('Cannot initialize Unicorn Hat HD device on this machine'));
}


// unicorn display settings for colors, orientation
const colors = {
  workCompleted: [50, 250, 50],
  pauseCompleted: [250, 50, 50],
  workCompletedStopped: [25, 50, 25],
  pauseCompletedStopped: [50, 25, 25],
  done: [250, 250, 250], 
  off: [0, 0, 0],
};
const FLIP_H = false;
const FLIP_V = false;

module.exports = {
  displayFrame: function displayFrame(frame) {
    unicorn.clear();

    for (let y = 0; y < frame.length; y += 1) {
      for (let x = 0; x < frame[0].length; x += 1) {
        const toDisplay = frame[y][x] ? colors[frame[y][x]] : colors.off;
        unicorn.setPixel(x, y, ...toDisplay);
      }
    }
    unicorn.show(FLIP_H, FLIP_V);
  },

  displayOff: function displayOff() {
    unicorn.clear();
    unicorn.show();
  },
};
