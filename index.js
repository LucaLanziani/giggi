#!/usr/bin/env node
'use strict'

const program = require('commander');
const packageData = require('./package.json');


program
  .name('giggi')
  .version(packageData.version);

program
  .command('repo <action>', 'manages repo')
  .alias('r');

program
  .command('workspace <action>', 'manages workspace')
  .alias('w');

program.parse(process.argv);
