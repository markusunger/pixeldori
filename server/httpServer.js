const http = require('http');
const url = require('url');
const querystring = require('querystring');
const EventEmitter = require('events');

require('dotenv').config();

module.exports = (() => {
  let applicationState = 'Pixeldori initialized.';
  const setStateUpdate = (state) => {
    applicationState = `Timer is currently in ${state.timerState} ${state.timerMode} mode (${state.progress}% progress)`;
  };

  const commandEmitter = new EventEmitter;

  const server = http.createServer((req, res) => {
    // extract actual command from url query string
    const params = url.parse(req.url).query;
    const query = querystring.parse(params);
    if (!query.command) {
      res.statusCode = 400;
      res.end();
    } else {
      commandEmitter.emit('command', query);
      res.statusCode = 200;
      query.command === 'status' ? res.end(applicationState) : res.end();
    }
  });
  
  server.listen(process.env.PORT, () => console.log(`Pixeldori server started ...`));

  return {
    commandEmitter,
    setStateUpdate,
    close: () => { server.close() },
  };
})();
