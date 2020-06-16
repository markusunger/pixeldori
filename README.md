# Pixeldori

Pixeldori is a pomodoro timer that runs on a Raspberry Pi with a Unicorn Hat HD matrix display. 

## Installation

- `git clone` the repo on both the RPi and the machine where the client will run
- run `npm install` on both machines
- create a shell script in your `/home/<username>/bin` directory that calls
  `node pxd.js` in the `cli` folder (see `pxd.sh` in this repo, rename this to just `pxd`)
- create a `.env` file in your `cli` folder on the client machine (copy & rename `.env.example`) and specify the
  hostname and port of the Raspberry Pi server 
- create a `.env` file in your `server` folder on the Raspberry Pi (copy & rename `.env.example`) and
  specify the port on which the server should run
- spin up the server on your Raspberry Pi, e.g. by using `pm2`, entrypoint is `app.js`
- use `pxd` to see all available commands or see the usage section below

## Usage

```
pxd usage:
work    start a new work timer
pause   start a new pause timer
stop    interrupt and pause current timer
resume  continue current timer
quit    stop timer and turn off display
```

## Future work

- allow setting of work and pause block lengths
- add fancy animations for completion of a block