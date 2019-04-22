const os = require('os');
const path = require('path');
const jsondatastore = require('jsondatastore').DB;

const defaults = {
    version: 2,
    workspaces: {
        default: {}
    },
    config: {
        defaultWorkspace: 'default'
    }
}

const datastore = new jsondatastore(path.join(os.homedir(), '.giggi.json'), defaults);

if (datastore.get('version') === 1) {
    datastore
        .set('config', defaults.config)
        .set('version', 2)
        .save();
}

module.exports = datastore;