const os = require('os');
const path = require('path');
const jsondatastore = require('jds').DB;
const defaults = require('./config_defaults.js');
const datastore_path = path.join(os.homedir(), '.giggi.json');
const datastore = new jsondatastore(defaults, datastore_path);

if (datastore.get('version') === 1) {
    datastore
        .set('config', defaults.config)
        .set('version', 2)
        .save();
}

module.exports = datastore;