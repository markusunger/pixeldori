/*
  the pixeldori server entrypoint runs the main loop, continuously checking
  for updates to the timer's state, asking the display driver to create the
  frame, diffing it to the previous one and rendering it if there are changes
*/

const getStateUpdate = require('./lib/stateManager');
const frameRenderer = require('./lib/frameRenderer');
const { arrayEqual } = require('./lib/utils');
const { close } = require('./lib/httpServer');

let output;
try {
  output = require('./lib/display');
} catch (e) {
  // set output to mocked dev version for local testing when SPI device
  // cannot be initialized
  output = require('./lib/devDisplay');
}

let prevFrame = [];

const mainLoop = setInterval(() => {
  const state = getStateUpdate();

  // render new frame and send to output if different from previous one
  const newFrame = frameRenderer(state);
  if (!arrayEqual(prevFrame, newFrame)) output.displayFrame(newFrame);
  prevFrame = newFrame;
}, 1000);

// error and interrupt handling
const closeAndExit = (err = null) => {
  if (err) console.error(err);
  process.exitCode = 1;
  close();
  clearInterval(mainLoop);
}

process.on('SIGTERM', () => {
  closeAndExit();
});

process.on('SIGINT', () => {
  closeAndExit();
});

process.on('uncaughtException', (err) => {
  closeAndExit(err);
})