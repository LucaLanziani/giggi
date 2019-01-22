#!/usr/bin/env node
'use strict'

const program = require('commander');
const jsondatastore = require('jsondatastore').DB;
const path = require('path');
const git = require('simple-git/promise');
const datastore = new jsondatastore(path.resolve(__dirname, './test.json'));

function list (workspace) {
  workspace = workspace || 'default';
  console.log(Object.keys(datastore.get(`workspaces.${workspace}.repos`) || {}));
}

function add (repo, repoPath, workspace) {
  let absolutePath = path.isAbsolute(repoPath) ? repoPath : path.resolve(__dirname, repoPath); 
  workspace = workspace || 'default';
  datastore.set(`workspaces.${workspace}.repos.${repo}`, {path: absolutePath}).save();
}

function remove (repo, workspace) {
  datastore.unset(`workspaces.${workspace}.repos.${repo}`).save();
}

function update (repo, key, value, workspace) {
  workspace = workspace || 'default';
  if ( key === 'path' ) {
    value = path.isAbsolute(repoPath) ? repoPath : path.resolve(system.cwd(), repoPath);
  } 

  datastore.update(`workspaces.${workspace}.repos.${repo}`, function(repo) {
    repo[key] = value;
    return repo;
  }).save();
}

async function status(repo, workspace) {
  workspace = workspace || 'default';
  let r = datastore.get(`workspaces.${workspace}.repos.${repo}`, {});
  if (r.path) {
    status = await git(r.path).status();
    console.log(`${status.current} -> ${status.tracking} [${status.ahead}/${status.behind}] - ${status.staged}`);
    console.log(status);
  }
}

program
  .command('list [workspace]')
  .alias('l')
  .action(list);

program
  .command('add <repo> <path> [workspace]')
  .alias('a')
  .action(add);

program
  .command("delete <repo> [workspace]")
  .alias("d")
  .action(remove);

program
  .command('update <repo> <key> <value> [workspace]')
  .alias('u')
  .action(update);

program
  .command('status <repo> [workspace]')
  .alias('s')
  .action(status);

program.parse(process.argv);


module.export = {
  list,
  add,
  remove,
  update
}