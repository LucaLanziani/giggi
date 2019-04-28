"use strict";

const path = require("path");
const simpleGit = require("simple-git/promise");
const datastore = require("./datastore.js");
const slugify = require("slugify");
const utils = require("./utils.js");
const chalk = require("chalk");
const child_process = require("child_process");

slugify.extend({ ".": "-" });

function list(workspace) {
  workspace = workspace || datastore.get("config.defaultWorkspace");
  console.log(`${chalk.white("Workspace:")} ${chalk.blueBright(workspace)}\n`);
  console.log(
    Object.keys(datastore.get(`workspaces.${workspace}.repos`) || {})
  );
}

async function add(repoPath, workspace, repoName) {
  let absolutePath = path.resolve(repoPath);

  if (!utils.dirExist(absolutePath)) {
    return;
  }

  repoName = slugify(repoName || absolutePath.split(path.sep).pop());
  workspace = workspace || datastore.get("config.defaultWorkspace");
  if (!(await simpleGit(absolutePath).checkIsRepo())) {
    console.error(`${absolutePath} is not a git repo`);
    return;
  }

  if (datastore.get(`workspaces.${workspace}.repos.${repoName}`)) {
    console.error(`${repoName} name already defined in ${workspace} workspace`);
    console.error(
      `${repoName} -> ${datastore.get(
        `workspaces.${workspace}.repos.${repoName}.path`
      )}`
    );
    process.exit(1);
  }

  datastore
    .set(`workspaces.${workspace}.repos.${repoName}`, { path: absolutePath })
    .save();
}

function remove(repo, workspace) {
  datastore.unset(`workspaces.${workspace}.repos.${repo}`).save();
}

function update(repo, key, value, workspace) {
  workspace = workspace || datastore.get("config.defaultWorkspace");
  if (key === "path") {
    value = path.resolve(repoPath);
  }

  datastore
    .update(`workspaces.${workspace}.repos.${repo}`, function(repo) {
      repo[key] = value;
      return repo;
    })
    .save();
}

async function getSimpleGit(repo, workspace) {
  workspace = workspace || datastore.get("config.defaultWorkspace");
  let r = datastore.get(`workspaces.${workspace}.repos.${repo}`, {});

  if (r.path && utils.dirExist(r.path)) {
    try {
      return await simpleGit(r.path);
    } catch (err) {
      console.error(
        `Something went wrong initializing SimpleGit for ${repo} (${r.path})`
      );
      console.error(err);
    }
  }
}

async function getStatus(repo, workspace) {
  workspace = workspace || datastore.get("config.defaultWorkspace");
  let r = datastore.get(`workspaces.${workspace}.repos.${repo}`, {});

  try {
    let git = await getSimpleGit(repo, workspace);
    let status = await git.status();
    let trackingString = utils.formatTrackingString(
      status.current,
      status.tracking
    );
    let unstagedString = utils.formatUnstagedString(status);
    let stagedString = utils.formatStagedString(status);
    let { aheadString, behindString } = utils.formatAheadBehind(status);

    return `${chalk.green(
      r.path
    )}\n\t[${aheadString}/${behindString}] - ${unstagedString} ${stagedString} - ${
      status.current
    } <=> ${trackingString}`;
  } catch (err) {
    console.error(
      `Something went wrong trying to read the status of ${repo} (${r.path})`
    );
    console.error(err);
  }
}

async function fetch(repo, workspace) {
  workspace = workspace || datastore.get("config.defaultWorkspace");
  let r = datastore.get(`workspaces.${workspace}.repos.${repo}`, {});
  console.log(`\nfetching: ${chalk.green(r.path)}`);
  process.chdir(r.path);
  let git = child_process.spawnSync("git", ["fetch"], { stdio: "inherit" });
  if (git.status !== 0) {
    console.log(
      `${chalk.yellow(git.status)} ${chalk.red("failed to fetch: " + r.path)}`
    );
  }
}

async function status(repoName, workspace) {
  console.log(await getStatus(repoName, workspace));
}

async function cmd(repoName, workspace, command) {
  console.log(repoName, workspace, command);
}

module.exports = {
  list,
  add,
  remove,
  update,
  status,
  getStatus,
  fetch
};
