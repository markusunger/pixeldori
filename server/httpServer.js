const http = require('http');
const url = require('url');
const EventEmitter = require('events');

require('dotenv').config();

module.exports = (() => {
  const commandEmitter = new EventEmitter;

  const server = http.createServer((req, res) => {
    // extract actual command from url query string
    const command = url.parse(req.url).query.split('=')[1];
    commandEmitter.emit('command', command);
    res.statusCode = 200;
    res.end();
  });
  
  server.listen(process.env.PORT, () => console.log(`Pixeldori server started ...`));

  return commandEmitter;
})();
