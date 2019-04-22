#!/usr/bin/env node
'use strict'

const program = require('commander');
const repo = require('./libs/repo.js');
const workspace = require('./libs/workspace.js');
const packageData = require('./package.json');
const child_process = require('child_process');

program
  .name('giggi')
  .version(packageData.version);

program
  .command('list-workspace')
  .alias('lw')
  .action(workspace.list);

program
  .command('default-workspace <workspace>')
  .alias('dw')
  .action(workspace.setDefault);

program
  .command('workspace-status [workspace]')
  .alias('ws')
  .action(workspace.status)

program
  .command('list-repos [workspace]')
  .alias('lr')
  .action(repo.list);

program
  .command('add-repo <repo> [workspace] [repoName]')
  .alias('ar')
  .action(repo.add);

program
  .command("delete-repo <repoName> [workspace]")
  .alias("dr")
  .action(repo.remove);

program
  .command('update-repo <repoName> <key> <value> [workspace]')
  .alias('ur')
  .action(repo.update);

program
  .command('repo-status <repoName> [workspace]')
  .alias('rs')
  .action(repo.status);

program.on('command:*', function (args, opts) {
  let git = child_process.spawn('git', process.argv.slice(2), {stdio: 'inherit'});
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
};
