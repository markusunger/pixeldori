/*
  the pixeldori server entrypoint runs the main loop, continuously checking
  for updates to the timer's state, asking the display driver to create the
  frame, diffing it to the previous one and rendering it if there are changes
*/

const getStateUpdate = require('./appState');
const frameRenderer = require('./frameRenderer');
const { arrayEqual } = require('./utils');

let output;
try {
  output = require('./display');
} catch (e) {
  // set output to mocked dev version for local testing when SPI device
  // cannot be initialized
  output = require('./devDisplay');
}

let prevFrame = [];

setInterval(() => {
  const state = getStateUpdate();
  const newFrame = frameRenderer(state);
  if (!arrayEqual(prevFrame, newFrame)) output.displayFrame(newFrame);
  prevFrame = newFrame;
}, 1000);

process.on('SIGTERM', () => {
  output.displayOff();
  process.exit(-1);
});

process.on('SIGINT', () => {
  output.displayOff();
  process.exit(-1);
});