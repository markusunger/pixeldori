/*
  the stateManager manages the internal state, receiving events from the http server to update
  the current state, checking for time-based state changes (timer expires) and can give
  information (to the main loop) what the current timer state is
*/

const http = require('./httpServer');
const state = require('./appState').init();

module.exports = (function appState() {
  // listen to command events from the http server, update state accordingly
  http.commandEmitter.on('command', (query) => {
    switch (query.command) {
      case 'work':
        state.setTimerMode('work');
        state.setTimerState('active');
        break;
      case 'pause':
        state.setTimerMode('pause');
        state.setTimerState('active');
        break;
      case 'stop':
        state.setTimerState('paused');
        break;
      case 'resume':
        state.setTimerState('active');
        break;
      case 'quit':
        state.setTimerState('offline');
        break;
      case 'set':
        state.setBlockLength(query.type, parseInt(query.amount, 10));
        break;
      default:
        break;
    }
  });

  return function getStateUpdate() {
    const currentState = state.update();

    // update http server response for status requests from the cli
    http.setStateUpdate(currentState);

    return currentState;
  };
})();
