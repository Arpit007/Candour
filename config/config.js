/**
 * Created by Home Laptop on 01-Oct-17.
 */

const config = (process.env[ 'NODE_ENV' ] === 'production')
    ? require('./configDebug')
    : require('./configRelease');

global.config = config;
module.exports = config;