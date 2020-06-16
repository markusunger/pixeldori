#! /usr/bin/env node

// valid commands for the pixeldori server
const ALLOWED_COMMANDS = ['work', 'pause', 'stop', 'resume', 'quit', 'status', 'set'];

require('dotenv').config({
  path: `${__dirname}/.env`, // get actual path to script instead of shell script call site
});

const http = require('http');
const querystring = require('querystring');
const argv = require('minimist')(process.argv.slice(2));

const printHelp = () => {
  console.log(`pxd usage:
    status  outputs current timer status
    work    start a new work timer
    pause   start a new pause timer
    stop    interrupt and pause current timer
    resume  continue current timer
    quit    stop timer and turn off display
    set     sets either work or pause block length in minutes, e.g.
            set work 50  -> sets work block length to 50 minutes
            set pause 10 -> sets pause block lengths to 10 minutes
  `);
}

const printErrorAndExit = (err = "That doesn't work.") => {
  console.error(err);
  printHelp();
  process.exit(1);
};

/*
  -------------------
  ARGUMENT PROCESSING
  -------------------
*/

// check correct argument type and number
if (argv._.length < 1 || typeof argv._[0] !== 'string') {
  printErrorAndExit();
}

const [command, ...args] = argv._;

// check for valid command
if (!ALLOWED_COMMANDS.includes(command)) {
  printErrorAndExit(`'${command}' is not a valid command.`);
}

// check proper usage of set command
if (command === 'set') {
  if (args.length < 2) printErrorAndExit('Wrong parameter count for set.');

  if (!['work', 'pause'].includes(args[0]) || typeof args[1] !== 'number') {
    printErrorAndExit('Wrong arguments for set.');
  }
}

/*
  ------------------
  REQUEST PROCESSING
  ------------------
*/

// prepare request
const queryParams = querystring.stringify({
  command,
  ...(command === 'set' ? { type: args[0], amount: args[1] } : {}),
});

const requestOptions = {
  host: process.env.REMOTE_HOST,
  port: parseInt(process.env.REMOTE_PORT, 10),
  path: `/?${queryParams}`,
  method: 'GET',
};

// make request to pixeldori server
const request = http.request(requestOptions, (res) => {
  let data = '';

  res.on('error', () => {
    console.error(`Cannot send command to Pixeldori server.`);
  });

  res.on('data', chunk => data += chunk.toString());

  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error('The Pixeldori server was not happy with your command :(');
    } else {
      console.log(`OK! ${data}`);
    }
  });
});

request.on('error', () => {
  console.error(`Error connecting to Pixeldori server at ${process.env.REMOTE_HOST}`);
});

request.end();
