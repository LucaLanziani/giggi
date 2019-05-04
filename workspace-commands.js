#!/usr/bin/env node
'use strict'

const program = require('commander');
const workspace = require('./libs/workspace.js');

program
  .command('workspace-list')
  .description('list workspaces')
  .alias('wl')
  .action(workspace.list);

program
  .command('workspace-set-default <workspace>')
  .description('set default workspace')
  .alias('wsd')
  .action(workspace.setDefault);

program
  .command('workspace-remove')
  .description('remove the workspace')
  .alias('wr')
  .action(workspace.remove);

program
  .command('workspace-status [workspace]')
  .description('get status of all repos in the workspace')
  .alias('ws')
  .action(workspace.status);

program
  .command('worspace-from-dir <directory> [workspace]')
  .description('create a workspace from the given directory, all repo in the directory are added to the workspace')
  .alias('wfd')
  .action(workspace.workspaceFromDir);

program
  .command('workspace-fetch [workspace]')
  .description('run fetch on all repos in the workspace')
  .alias('wf')
  .action(workspace.fetch);
