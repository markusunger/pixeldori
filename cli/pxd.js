#! /usr/bin/env node

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

const requestOptions = {
  host: process.env.REMOTE_HOST,
  port: parseInt(process.env.REMOTE_PORT, 10),
  path: `/?command=${argv._[0]}`,
  method: 'GET',
};

const request = http.request(requestOptions, (res) => {
  res.on('error', () => {
    console.error(`Error connecting to Pixeldori server at ${process.env.REMOTE_HOST}`);
  });

  if (res.statusCode !== 200) {
    console.error('Could not send command to Pixeldori server.');
  } else {
    console.log('OK!');
  }
  process.exit(1);
});
request.on('error', () => {
  console.error(`Error connecting to Pixeldori server at ${process.env.REMOTE_HOST}`);
});

request.end();