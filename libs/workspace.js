const datastore = require('./datastore.js');
const repo = require('./repo.js');

async function forEachRepo(workspace, fn) {
  workspace = workspace || datastore.get('config.defaultWorkspace');
  let repos = Object.keys(datastore.get(`workspaces.${workspace}.repos`, {}))
  for (let index=0; index < repos.length; index++) {
    await fn(repos[index], workspace);
  }
}

async function status (workspace) {
  forEachRepo(workspace, async (repoName, workspace) => {
    result = await repo.getStatus(repoName, workspace);
    if (result) {
      console.log(result);
    }
  });
}

function list () {
  let workspaces = Object.keys(datastore.get('workspaces'));
  let defaultWorkspace = workspaces.indexOf(datastore.get('config.defaultWorkspace'));
  workspaces[defaultWorkspace] = `*${workspaces[defaultWorkspace]}`;
  console.log(workspaces); 
}

function setDefault (workspace) {
  if (Object.keys(datastore.get('workspaces')).includes(workspace)) {
    datastore.set('config.defaultWorkspace', workspace).save();
  } else {
    console.error(`Workspace ${workspace} not found`);
  }
}

function cmd (workspace) {
  forEachRepo(workspace, )
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
  setDefault
}