#!/usr/bin/env node
'use strict'

const program = require('commander');
const packageData = require('./package.json');
const child_process = require('child_process');

require('./repo-commands.js');
require('./workspace-commands.js');

program
  .name('giggi')
  .version(packageData.version);

program.on('command:*', function (args, opts) {
  let git = child_process.spawnSync('git', process.argv.slice(2), {stdio: 'inherit'});
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
};
