#! /usr/bin/env node

// valid commands for the pixeldori server
const ALLOWED_COMMANDS = ['work', 'pause', 'stop', 'resume'];

require('dotenv').config({
  path: `${__dirname}/.env`, // get actual path to script instead of call site
});

const http = require('http');
const argv = require('minimist')(process.argv.slice(2));

const printHelp = () => {
  console.log(`pxd usage:
    work    start a new work timer
    pause   start a new pause timer
    stop    interrupt current timer
    resume  continue current timer
  `);
}

if (argv._.length < 1 || typeof argv._[0] !== 'string') {
  printHelp();
  process.exit(1);
}

const command = argv._[0];

if (!ALLOWED_COMMANDS.includes(command)) {
  console.error(`${command} is not a valid command.`);
  printHelp();
  process.exit(1);
}

const requestOptions = {
  host: process.env.REMOTE_HOST,
  port: parseInt(process.env.REMOTE_PORT, 10),
  path: `/?command=${argv._[0]}`,
  method: 'GET',
};

const request = http.request(requestOptions, (res) => {
  res.on('error', () => {
    console.error(`Cannot send command to Pixeldori server.`);
  });

  if (res.statusCode !== 200) {
    console.error('The Pixeldori server was not happy with your command :(');
  } else {
    console.log('OK!');
  }
  process.exit(1);
});
request.on('error', () => {
  console.error(`Error connecting to Pixeldori server at ${process.env.REMOTE_HOST}`);
});

request.end();