const getStateUpdate = require('./appState');
const display = require('./displayDriver');
const renderer = require('./renderer');

setInterval(() => {
  const state = getStateUpdate();
  const newFrame = display.deriveFrameFromState(state);
  renderer.renderFrame(newFrame);
}, 10);

process.on('SIGTERM', () => {
  renderer.turnOff();
});