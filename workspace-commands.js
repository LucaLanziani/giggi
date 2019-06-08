#!/usr/bin/env node
'use strict'

const yargs = require('yargs'); 
const workspace = require('./libs/workspace.js'); 

yargs
  .command({
    command: 'workspace-list',
    desc: 'list workspaces',
    aliases: 'wl',
    handler: workspace.list
  });

yargs
  .command({
    command: 'workspace-set-default <workspace>', 
    desc: 'set default workspace', 
    aliases: 'wsd', 
    handler: workspace.setDefault
  }); 

yargs
  .command({
    command: 'workspace-remove', 
    desc: 'remove the workspace', 
    aliases: 'wr', 
    handler: workspace.remove
  }); 

yargs
  .command({
    command: 'workspace-status [workspace]', 
    desc: 'get status of all repos in the workspace', 
    aliases: 'ws', 
    handler: workspace.status
  }); 

yargs
  .command({
    command: 'workspace-from-dir <directory> [workspace]', 
    desc: 'create a workspace from the given directory, all repo in the directory are added to the workspace', 
    aliases: 'wfd', 
    handler: workspace.workspaceFromDir
  }); 

yargs
  .command({
    command: 'workspace-fetch [workspace]', 
    desc: 'run fetch on all repos in the workspace', 
    aliases: 'wf', 
    handler: workspace.fetch
  }); 
