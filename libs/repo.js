"use strict";

const path = require("path");
const simpleGit = require("simple-git/promise");
const datastore = require("./datastore.js");
const slugify = require("slugify");
const utils = require("./utils.js");
const chalk = require("chalk");
const child_process = require("child_process");

slugify.extend({ ".": "-" });

function _getValue(workspace, repo, property) {
  return datastore.get(`workspaces.${workspace}.repos.${repo}.${property}`);
}

function list(argv) {
  let workspace = argv.workspace || datastore.get("config.defaultWorkspace");
  console.log(`Workspace: ${chalk.blueBright(workspace)}\n`);
  console.log(
    Object.keys(datastore.get(`workspaces.${workspace}.repos`) || {})
      .map(
        repoName =>
          `  - ${chalk.yellow(repoName)} (${chalk.green(
            _getValue(workspace, repoName, "path")
          )})`
      )
      .join(`\n`)
  );
}

async function add(argv) {
  let { repoPath, repoName, workspace } = argv;
  let absoluteDirPath = path.resolve(repoPath);

  if (!utils.dirExist(absoluteDirPath)) {
    return false;
  }

  let absolutePath = await simpleGit(absoluteDirPath).raw([
    "rev-parse",
    "--show-toplevel"
  ]);

  if (absolutePath === null) {
    console.error(`${absolutePath} is not a git repo`);
    return false;
  }

  absolutePath = absolutePath.trim();
  repoName = slugify(repoName || absolutePath.split(path.sep).pop());
  workspace = workspace || datastore.get("config.defaultWorkspace");

  if (datastore.get(`workspaces.${workspace}.repos.${repoName}`)) {
    console.error(
      `${chalk.yellow(repoName)} already defined in ${chalk.blueBright(
        workspace
      )} workspace`
    );
    return false;
  }

  datastore
    .set(`workspaces.${workspace}.repos.${repoName}`, { path: absolutePath })
    .save();

  console.log(
    `${chalk.yellow(repoName)} (${chalk.green(
      absolutePath
    )}) added to ${chalk.blueBright(workspace)}`
  );
  return true;
}

function remove(argv) {
  let { repo } = argv;
  let workspace = argv.workspace || datastore.get("config.defaultWorkspace");

  datastore.unset(`workspaces.${workspace}.repos.${repo}`).save();
}

function update(argv) {
  let { repo, key, value } = argv;
  let workspace = argv.workspace || datastore.get("config.defaultWorkspace");

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

async function getSimpleGit(argv) {
  let { repo, workspace } = argv;
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

async function getStatus(argv) {
  let { repo, workspace } = argv;
  workspace = workspace || datastore.get("config.defaultWorkspace");
  let r = datastore.get(`workspaces.${workspace}.repos.${repo}`, {});

  try {
    let git = await getSimpleGit({ repo, workspace });
    let status = await git.status();
    let branches = await git.branch();
    let trackingString = utils.formatTrackingString(
      status.current,
      status.tracking
    );
    let unstagedString = utils.formatUnstagedString(status);
    let stagedString = utils.formatStagedString(status);
    let { aheadString, behindString } = utils.formatAheadBehind(status);
    let numberOfBranches = `${branches.all.length}`.padStart(3);
    return `${chalk.green(
      r.path
    )}\n\t[${aheadString}/${behindString}] - ${unstagedString} ${stagedString} - ${numberOfBranches} branches - ${
      status.current
    } <=> ${trackingString}`;
  } catch (err) {
    console.error(
      `Something went wrong trying to read the status of ${repo} (${r.path})`
    );
    return "";
  }
}

async function fetch(argv) {
  let { repo, workspace } = argv;
  workspace = workspace || datastore.get("config.defaultWorkspace");
  let r = datastore.get(`workspaces.${workspace}.repos.${repo}`, {});
  console.log(`\nfetching: ${chalk.green(r.path)}`);
  process.chdir(r.path);
  let git = child_process.spawnSync("git", ["fetch"], { stdio: "inherit" });
  if (git.status !== 0) {
    console.error(
      `${chalk.yellow(git.status)} ${chalk.red("failed to fetch: " + r.path)}`
    );
  }
}

async function status(argv) {
  let { repoName, workspace } = argv;
  console.log(await getStatus({ repoName, workspace }));
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
