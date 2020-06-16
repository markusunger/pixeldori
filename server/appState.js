/*
  AppState is a prototype object for the pixeldori application state, a simple
  state machine that keeps track of the current timer status and handles all
  implications of a state change
*/

const getUnixSeconds = function getUnixSeconds() { return Date.now() / 1000 };

module.exports = (function AppState() {
  const timerModes = ['work', 'pause'];

  return {
    // initialize app state with defaults
    init: function init() {
      this.timerState = 'offline';
      this.timerMode = 'work';
      this.startTime = 0;
      this.elapsedTime = 0;
      this.progressPercent = 0;
      this.workBlockLength = 50;
      this.pauseBlockLength = 10;

      return this;
    },

    // handling transitions to other timer states
    setTimerState: function setTimerState(newState) {
      switch (newState) {
        case 'offline':
          this.progressPercent = 0;
          this.timerState = 'offline';
          break;
        case 'active':
          if (this.timerState === 'paused') {
            const currentTime = getUnixSeconds();
            this.startTime = currentTime - this.elapsedTime;
            this.timerState = newState;
          }

          if (this.timerState === 'offline' || this.timerState === 'completed') {
            this.startTime = getUnixSeconds();
            this.elapsedTime = 0;
            this.timerState = newState;
          }
          break;
        case 'paused':
          if (this.timerState === 'active') {
            const currentTime = getUnixSeconds();
            this.elapsedTime = currentTime - this.startTime;
            this.progressPercent = this.calculateProgressPercent(currentTime);
            this.timerState = newState;
          }
          break;
        case 'completed':
          this.progressPercent = 100;
          this.timerState = newState;
          break;
        default:
          throw new Error('Failing due to unknown timer state');
      }
    },

    setTimerMode: function setTimerMode(newMode) {
      if (!timerModes.includes(newMode)) throw (new Error('Timer mode is invalid.'));
      this.timerMode = newMode;
    },

    getBlockLength: function getBlockLength() {
      if (this.timerMode === 'work') return this.workBlockLength;
      if (this.timerMode === 'pause') return this.pauseBlockLength;
    },

    setBlockLength: function setBlockLength(blockType, newLength) {
      if (blockType === 'work') {
        this.workBlockLength = newLength;
      }
      if (blockType === 'pause') {
        this.pauseBlockLength = newLength;
      }
    },


    calculateProgressPercent: function calculateProgressPercent(currentTime) {
      const elapsedTime = currentTime - this.startTime;
      const progress = (100 * elapsedTime) / this.getBlockLength();
      return Math.round(progress);
    },

    handleCompletion: function handleCompletion(currentTime) {
      const blockEndTime = this.startTime + this.getBlockLength();

      if (blockEndTime < currentTime) {
        this.setTimerState('completed');
      }
    },

    update: function update() {
      if (this.timerState === 'active') {
        const currentTime = getUnixSeconds();
        this.progressPercent = this.calculateProgressPercent(currentTime);
        this.handleCompletion(currentTime);
      }

      return {
        timerState: this.timerState,
        timerMode :this.timerMode,
        progress: this.progressPercent,
      };
    },


  }
})();
