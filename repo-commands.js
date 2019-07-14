#!/usr/bin/env node
'use strict'

const yargs = require('yargs');
const repo = require('./libs/repo.js');

yargs
  .command({
    command: 'repo-list [workspace]',
    desc: 'list all repos in a workspace',
    aliases: ['rl'],
    handler: repo.list
  });
    
yargs
  .command({
    command: 'repo-add <repoPath> [workspace] [repoName]',
    desc: 'add a repo to a workspace',
    aliases: ['ra'],
    handler: repo.add
  });

yargs
  .command({
    command: 'repo-delete <repoName> [workspace]',
    desc: 'delete a repo from a workspace',
    aliases: 'rd',
    handler: repo.remove
  })

yargs
  .command({
    command: 'repo-update <repoName> <key> <value> [workspace]',
    desc: 'update a property of a repo',
    aliases: 'ru',
    handler: repo.update
  });

yargs
  .command({
    command: 'repo-status <repoName> [workspace]',
    desc: 'get status of a repo',
    aliases: 'rs',
    handler: repo.status
  });

yargs
  .command({
    command: 'repo-fetch <repoName> [workspace]',
    desc: 'run fetch on a repo',
    aliases: 'rf',
    handler: repo.fetch
  });

