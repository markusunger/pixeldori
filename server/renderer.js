const UnicornHD = require('unicornhat-hd');

let unicorn;
try {
  unicorn = new UnicornHD('/dev/spidev0.0');
} catch (err) {
  throw(new Error('Cannot initialize Unicorn Hat HD device on this machine'));
}

const FLIP_H = false;
const FLIP_V = false;

module.exports = {
  renderFrame: function renderFrame(frame) {
    unicorn.clear();

    for (let i = 0; i < frame[0].length; i += 1) {
      for (let j = 0; j < frame.length; j += 1) {
        if (frame[i][j]) {
          unicorn.setPixel(i, j, ...frame[i][j]);
        }
      }
    }

    unicorn.show(FLIP_H, FLIP_V);
  },

  turnOff: function turnOff() {
    unicorn.off();
  },
};
