const datastore = require('./datastore.js');
const repo = require('./repo.js');
const chalk = require("chalk");
const { lstatSync, readdirSync } = require('fs');
const { join, resolve, basename } = require('path');
const { existsSync } = require('fs');

async function forEachRepo(workspace, fn) {
  workspace = workspace || datastore.get('config.defaultWorkspace');
  let repos = Object.keys(datastore.get(`workspaces.${workspace}.repos`, {}))
  for (let index=0; index < repos.length; index++) {
    await fn(repos[index], workspace);
  }
}

async function status (workspace, cmd) {
  forEachRepo(workspace, async (repoName, workspace) => {
    result = await repo.getStatus(repoName, workspace);
    if (result) {
      console.log(result);
    }
  });
}


async function workspaceFromDir (directory, workspace) {
  let absolutePath = resolve(directory);
  const isDirectory = source => lstatSync(source).isDirectory();
  const isGitRepo = source => existsSync(join(source, '.git')) && lstatSync(join(source, '.git')).isDirectory();
  const workspaceName = workspace || basename(absolutePath);
  if (existsSync(absolutePath)) {

    let result = await Promise.all(readdirSync(absolutePath)
      .map(name => join(absolutePath, name))
      .filter(isDirectory)
      .filter(isGitRepo)
      .map(repoPath => repo.add(repoPath, workspaceName)));

    if (result.length === 0 || ! result.reduce((prev, next,) => prev && next, true)) {
      console.error(chalk.red(`No repo added to ${chalk.blueBright(workspaceName)}`));
    }
  }
}

function _numberOfRepos (workspace) {
  return Object.keys(datastore.get(`workspaces.${workspace}.repos`)).length
}

function list () {
  let workspaces = Object.keys(datastore.get('workspaces'));
  let defaultWorkspace = datastore.get('config.defaultWorkspace');

  workspaces.forEach(workspace => {
    console.log(chalk.blueBright(workspace), `(${_numberOfRepos(workspace)})`);
  });
  
}

function setDefault (workspace) {
  if (Object.keys(datastore.get('workspaces')).includes(workspace)) {
    datastore.set('config.defaultWorkspace', workspace).save();
  } else {
    console.error(`Workspace ${workspace} not found`);
  }
}

function fetch(workspace) {
  forEachRepo(workspace, async (repoName, workspace) => {
    await repo.fetch(repoName, workspace);
  });
}

function remove (workspace) {
  return datastore.unset(`workspaces.${workspace}`).save();
}

async function tmux (workspace) {
  workspace = workspace || datastore.get('config.defaultWorkspace');
  let repos = Object.keys(datastore.get(`workspaces.${workspace}.repos`, {}))

  for (let index=0; index < repos.length; index++) {
    result = await repo.getStatus(repos[index], workspace);
    if (result) {
      console.log(result);
    }
  }
}

module.exports = {
  list,
  status,
  setDefault,
  fetch,
  remove,
  workspaceFromDir
}