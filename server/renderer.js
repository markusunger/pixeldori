const UnicornHD = require('unicornhat-hd');

let Ud;
try {
  Ud = new UnicornHD('/dev/spidev0.0');
} catch (err) {
  throw(new Error('Cannot initialize Unicorn Hat HD device on this machine'));
}

module.exports = Ud;
