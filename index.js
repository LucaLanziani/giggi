#!/usr/bin/env node
'use strict'

const packageData = require('./package.json');
const child_process = require('child_process');
const yargs = require('yargs');

require('./repo-commands.js');
require('./workspace-commands.js');

yargs
  .command(['git [command..]', '$0'], 'run a git command', () => {}, (argv) => {
    if (process.argv.length < 3) {
      return console.error('Use --help to show valid commands');
    }
    child_process.spawnSync('git', process.argv.slice(2), {stdio: 'inherit'});
  })
  .wrap(yargs.terminalWidth())
  .scriptName('giggi')
  .argv;