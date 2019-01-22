#!/usr/bin/env node
'use strict'

const program = require('commander');
const jsondatastore = require('jsondatastore').DB;
const path = require('path');
const datastore = new jsondatastore(path.resolve(__dirname, './test.json'));
const { spawn } = require('child_process');

program
  .command('list')
  .alias('l')
  .action(function() {
    console.log(Object.keys(datastore.get('workspaces')));
  });

program
  .command('status <workspace>')
  .alias('s')
  .action(function (workspace) {
    datastore.get(`workspaces.${workspace}.repos`, []).forEach(repo => {
      console.log(sub)
    });
  })

program.parse(process.argv);