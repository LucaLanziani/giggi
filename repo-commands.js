#!/usr/bin/env node
'use strict'

const program = require('commander');
const repo = require('./libs/repo.js');


program
  .command('repo-list [workspace]')
  .description('list all repos in a workspace')
  .alias('rl')
  .action(repo.list);

program
  .command('repo-add <directory> [workspace] [repoName]')
  .description('add a repo to a workspace')
  .alias('ra')
  .action(repo.add);

program
  .command("repo-remove <repoName> [workspace]")
  .description('remove a repo from a workspace')
  .alias("rr")
  .action(repo.remove);

program
  .command('repo-update <repoName> <key> <value> [workspace]')
  .description('update a property of a repo')
  .alias('ru')
  .action(repo.update);

program
  .command('repo-status <repoName> [workspace]')
  .description('get status of a repo')
  .alias('rs')
  .action(repo.status);

program
  .command('repo-fetch <repoName> [workspace]')
  .description('run fetch on a repo')
  .alias('rf')
  .action(repo.fetch);

