const jsondatastore = require('jds');
jsondatastore.DB = jsondatastore.InMemoryDB;
const path = require('path');
const datastore = require('../libs/datastore.js');
const defaults = require('../libs/config_defaults.js');
const workspace = require('../libs/workspace.js');
const child_process = require("child_process");
const validWorkspace = path.join(__dirname, './fixtures/validWorkspace');
const emptyWorkspace = path.join(__dirname, './fixtures/emptyWorkspace');

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

test('Workspace list', () => {
    workspace.list();
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toMatch(/default/);
});

test('Workspace from dir', async () => {
    await workspace.workspaceFromDir({directory: validWorkspace});
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls.length).toBe(2);
});

test('Workspace from dir failure', async () => {
    await workspace.workspaceFromDir({directory: emptyWorkspace});
    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toMatch(/No repo added to .*emptyWorkspace.*/);
});

test('Empty workspace status', async () => {
    await workspace.status({});
    expect(console.log).not.toHaveBeenCalled();
});

test('Workspace status', async () => {
    await workspace.workspaceFromDir({directory: validWorkspace});
    console.log.mockClear();
    await workspace.status({workspace: 'validWorkspace'});
    expect(console.log).toHaveBeenCalled();
});

test('Workspace remove', async () => {
    await workspace.workspaceFromDir({directory: validWorkspace});
    let datastore = workspace.remove({workspace: 'validWorkspace'});
    expect(datastore.get('workspaces.validWorkspace')).toBe(undefined);
});

test('Workspace setDefault', async () => {
    await workspace.workspaceFromDir({directory: validWorkspace});
    console.log.mockClear();
    workspace.setDefault({workspace: 'validWorkspace'});
    workspace.list();
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls.length).toBe(2);
    expect(console.log.mock.calls[1][0]).toMatch(/validWorkspace.*\*/);
    console.log.mockClear();
    await workspace.status();
    expect(console.log).toHaveBeenCalled();
});

test('worspace fetch', async () => {
    await workspace.workspaceFromDir({directory: validWorkspace});
    console.log.mockReset();
    workspace.setDefault({workspace: 'validWorkspace'});
    spy_spawnSync.mockClear();
    await workspace.fetch();
    expect(spy_process_chdir).toHaveBeenCalled();
    expect(spy_spawnSync).toHaveBeenCalled();
    expect(spy_spawnSync.mock.calls.length).toBe(2);
});

test('workspace rename', async () => {
    await workspace.workspaceFromDir({directory: validWorkspace});
    workspace.rename({prevName: 'validWorkspace', newName: 'newValidWorkspace'});

    expect(datastore.get('workspaces.validWorkspace')).toBe(undefined);
    expect(datastore.get('workspaces.newValidWorkspace')).not.toBe(undefined);
    expect(console.log).toHaveBeenCalled();
    console.log.mockReset();

    workspace.rename({prevName: 'validWorkspace', newName: 'newValidWorkspace'});
    expect(console.error).toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
});