const jsondatastore = require('jds');
jsondatastore.DB = jsondatastore.InMemoryDB;
const path = require('path');
const datastore = require('../libs/datastore.js');
const defaults = require('../libs/config_defaults.js');
const workspace = require('../libs/workspace.js');
const repo = require('../libs/repo.js');
const child_process = require("child_process");
const validWorkspace = path.join(__dirname, './fixtures/validWorkspace');

const spy_process_chdir = jest.spyOn(process, 'chdir');
const spy_spawnSync = jest.spyOn(child_process, 'spawnSync');

beforeAll(() => {
    ['firstRepo', 'secondRepo'].forEach((repo) => {
        child_process.spawnSync('git', ['-C', path.join(validWorkspace, repo), 'init', '-q'], {stdio: 'inherit'});
    });

    global.console.log = jest.fn();
    global.console.error = jest.fn();
});

afterEach(() => { 
    datastore.db = Object.assign({}, defaults);
    global.console.log.mockReset();
    global.console.error.mockReset();
});

test('Repo list', async () => {
    await workspace.workspaceFromDir({directory: validWorkspace});
    console.log.mockClear();
    repo.list({workspace: 'validWorkspace'});
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls.length).toBe(2);
    expect(console.log.mock.calls[0][0]).toMatch(/.*validWorkspace.*/);
    expect(console.log.mock.calls[1][0]).toMatch(/.*firstRepo.*\n.*secondRepo.*/);
});

test('Repo add', async () => {
    await repo.add({
        repoPath: path.join(validWorkspace, 'firstRepo'),
        repoName: "firstRepo"
    });

    expect(datastore.get('workspaces').default.repos).toHaveProperty('firstRepo.path')
})

test('Repo remove', async () => {
    await repo.add({
        repoPath: path.join(validWorkspace, 'firstRepo'),
        repoName: "firstRepo"
    });

    expect(datastore.get('workspaces').default.repos).toHaveProperty('firstRepo.path')

    repo.remove({repo: 'firstRepo'});
    expect(datastore.get('workspaces').default.repos).not.toHaveProperty('firstRepo.path')
});

test('Repo update', async () => {
    await repo.add({
        repoPath: path.join(validWorkspace, 'firstRepo'),
        repoName: "firstRepo"
    });

    expect(datastore.get('workspaces').default.repos).toHaveProperty('firstRepo.path');
    repo.update({
        repo: 'firstRepo',
        key: 'name',
        value: 'firstRepo'
    });
    expect(datastore.get('workspaces').default.repos).toHaveProperty('firstRepo.name');
});

test('Repo status', async () => {
    await repo.add({
        repoPath: path.join(validWorkspace, 'firstRepo'),
        repoName: "firstRepo"
    });

    expect(datastore.get('workspaces').default.repos).toHaveProperty('firstRepo.path');
    console.log.mockClear();

    await repo.status({repo: 'firstRepo'});
    expect(console.log).toHaveBeenCalled();
});

test('Repo fetch', async () => {
    await repo.add({
        repoPath: path.join(validWorkspace, 'firstRepo'),
        repoName: "firstRepo"
    });

    expect(datastore.get('workspaces').default.repos).toHaveProperty('firstRepo.path');
    console.log.mockClear();
    console.error.mockClear();

    await repo.fetch({
        repo: 'firstRepo'
    });
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.error).not.toHaveBeenCalled();
});

