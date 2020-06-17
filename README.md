# Pixeldori

Pixeldori is a pomodoro timer that runs on a Raspberry Pi with a Unicorn Hat 16x16 LED matrix display. 

## Installation

- `git clone` the repo on both the RPi and the machine where the client will run
- run `npm install` on both machines
- create a shell script in your `/home/<username>/bin` (or somewhere else as lonmg as that directory is in your PATH variable) 
  directory that calls `node pxd.js` in the `cli` folder (see `pxd.sh` in this repo, adapt and rename this to just `pxd`)
- create a `.env` file in your `cli` folder on the client machine (copy & rename `.env.example`) and specify the
  hostname and port of the Raspberry Pi server 
- create a `.env` file in your `server` folder on the Raspberry Pi (copy & rename `.env.example`) and
  specify the port on which the server should run
- spin up the server on your Raspberry Pi, e.g. by using `pm2`, entrypoint is `app.js`
- use `pxd` on your client machine to see all available commands or see the usage section below

## Usage

Use the `pxd` command to see a help message with all commands.

```
pxd usage:
    status  outputs current timer status
    work    start a new work timer
    pause   start a new pause timer
    stop    interrupt and pause current timer
    resume  continue current timer
    quit    stop timer and turn off display
    set     sets either work or pause block length in minutes, e.g.
            set work 50  -> sets work block length to 50 minutes
            set pause 10 -> sets pause block lengths to 10 minutes
```

## Future work

- state persistence to allow long and short pauses
- animations and eye-candy on the Unicorn Hat