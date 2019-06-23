const datastore = require("./datastore.js");
const repo = require("./repo.js");
const chalk = require("chalk");
const { lstatSync, readdirSync } = require("fs");
const { join, resolve, basename } = require("path");
const { existsSync } = require("fs");

async function forEachRepo(workspace, fn) {
  workspace = workspace || datastore.get("config.defaultWorkspace");
  let repos = Object.keys(datastore.get(`workspaces.${workspace}.repos`, {}));
  for (let index = 0; index < repos.length; index++) {
    await fn(repos[index], workspace);
  }
}

async function status(argv) {
  argv = argv || {};
  let workspace = argv.workspace;

  await forEachRepo(workspace, async (repoName, workspace) => {
    result = await repo.getStatus({ repo: repoName, workspace });
    if (result) {
      console.log(result);
    }
  });
}

async function workspaceFromDir(argv) {
  let { directory, workspace } = argv;
  let absolutePath = resolve(directory);
  const isDirectory = source => lstatSync(source).isDirectory();
  const isGitRepo = source =>
    existsSync(join(source, ".git")) &&
    lstatSync(join(source, ".git")).isDirectory();
  const workspaceName = workspace || basename(absolutePath);
  if (existsSync(absolutePath)) {
    let result = await Promise.all(
      readdirSync(absolutePath)
        .map(name => join(absolutePath, name))
        .filter(isDirectory)
        .filter(isGitRepo)
        .map(repoPath => repo.add({ repoPath, workspace: workspaceName }))
    );

    if (
      result.length === 0 ||
      !result.reduce((prev, next) => prev && next, true)
    ) {
      console.error(
        chalk.red(`No repo added to ${chalk.blueBright(workspaceName)}`)
      );
    }
  }
}

function _numberOfRepos(workspace) {
  return Object.keys(datastore.get(`workspaces.${workspace}.repos`, {})).length;
}

function list() {
  let workspaces = Object.keys(datastore.get("workspaces"));
  let defaultWorkspace = datastore.get("config.defaultWorkspace");
  workspaces.forEach(workspace => {
    let isDefault = "";
    if (workspace === defaultWorkspace) {
      isDefault = "*";
    }
    console.log(
      `${chalk.blueBright(workspace)}${isDefault}`,
      `(${_numberOfRepos(workspace)})`
    );
  });
}

function setDefault(argv) {
  let workspace = argv.workspace;

  if (Object.keys(datastore.get("workspaces")).includes(workspace)) {
    datastore.set("config.defaultWorkspace", workspace).save();
  } else {
    console.error(`Workspace ${workspace} not found`);
  }
}

async function fetch(argv) {
  argv = argv || {};
  let workspace = argv.workspace;
  await forEachRepo(workspace, async (repoName, workspace) => {
    await repo.fetch({ repo: repoName, workspace });
  });
}

function remove(argv) {
  let workspace = argv.workspace;
  return datastore.unset(`workspaces.${workspace}`).save();
}

function rename(argv) {
  let { prevName, newName } = argv;

  if (_exists(newName)) {
    return console.error(
      `Workspace ${newName} already present in the datastore`
    );
  }

  datastore.update(`workspaces`, function(workspaces) {
    workspaces[newName] = workspaces[prevName];
    delete workspaces[prevName];
    return workspaces;
  });
  console.log(`Workspace ${prevName} renamed to ${newName}`);
}

function _exists(workspace) {
  return datastore.get(`workspaces.${workspace}`) !== undefined;
}

async function tmux(workspace) {
  workspace = workspace || datastore.get("config.defaultWorkspace");
  let repos = Object.keys(datastore.get(`workspaces.${workspace}.repos`, {}));

  for (let index = 0; index < repos.length; index++) {
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
  rename,
  workspaceFromDir
};
