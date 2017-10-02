/**
 * Created by Home Laptop on 01-Oct-17.
 */
const oauthServer = require('oauth2-server');

const config = (process.env[ 'NODE_ENV' ] === 'production')
    ? require('./configDebug')
    : require('./configRelease');

const dbDictionary = {
    'mongoDB' : '../db/mongoDB/index',
    'mySql' : '../db/mySql/index'
};

global.config = config;
global.authServer = new oauthServer({ model : require(dbDictionary[ config.dB.name ]) });

module.exports = config;