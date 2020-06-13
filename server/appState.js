/*
  appState manages the internal state, receiving events from the http server to update
  the current state, checking for time-based state changes (timer expires) and can give
  information (to the main loop) what the current timer state is
*/

const commandEmitter = require('./httpServer');

const getUnixSeconds = function getUnixSeconds() { return Date.now() / 1000 };

const capitalize = function capitalize(str) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
}

const getProgress = function calculatePercentage(elapsed, target) {
  return parseInt((100 * elapsed) / target, 10);
};

module.exports = (function appState() {
  // set length of both pomodoro blocks in seconds
  const WORK_BLOCK_LENGTH = 10;
  const PAUSE_BLOCK_LENGTH = 5;

  // initial app state
  let timerState = 'offline';
  let currentMode = 'work';
  let startTime = 0;
  let elapsedTime = null;

  commandEmitter.on('command', (newCommand) => {
    switch (newCommand) {
      case 'work':
        timerState = 'activeWork';
        currentMode = 'work';
        startTime = getUnixSeconds();
        break;
      case 'pause':
        timerState = 'activePause';
        currentMode = 'pause';
        startTime = getUnixSeconds();
        break;
      case 'stop':
        timerState = `stopped${capitalize(currentMode)}`;
        elapsedTime = getUnixSeconds() - startTime;
        break;
      case 'resume':
        timerState = `active${capitalize(currentMode)}`;
        startTime = getUnixSeconds() - elapsedTime;
        break;
      case 'quit':
        timerState = 'offline';
        break;
      default:
        break;
    }
  });

  const updateState = function updateState() {
    const currentTime = getUnixSeconds();
    const elapsed = currentTime - startTime;

    // no state updates when timer is stopped
    if (timerState.startsWith('stopped')) return true;

    if (timerState === 'activeWork' && elapsed > WORK_BLOCK_LENGTH) {
      timerState = 'completedWork';
    }

    if (timerState === 'activePause' && elapsed > PAUSE_BLOCK_LENGTH) {
      timerState = 'completedPause';
    }
  };

  return function getStateUpdate() {
    updateState();
    // determine amount of time 
    const elapsed = timerState.startsWith('stopped') 
      ? elapsedTime
      : getUnixSeconds() - startTime;
    const target = currentMode === 'work' ? WORK_BLOCK_LENGTH : PAUSE_BLOCK_LENGTH;

    return {
      timerState,
      progress: getProgress(elapsed, target),
    }
  };
})();
