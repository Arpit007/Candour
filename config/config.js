/**
 * Created by StarkX on 07-Mar-18.
 */

let config = null;

if (process.env[ 'NODE_ENV' ] !== "development") {
    console.log('Production');
    config = require('./release');
    config.debugMode = false;
    config.dbConfig.url = process.env.MONGODB_URI || config.dbConfig.url;
}
else {
    console.log('Debugging');
    config = require('./debug');
    config.debugMode = true;
}

config.port = process.env.PORT || config.port;

global.xConfig = config;
module.exports = config;

const db = require('../src/model/db');