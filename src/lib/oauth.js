/**
 * Created by StarkX on 09-Apr-18.
 */
const oauthServer = require('./server');

let oauth = new oauthServer({
    model : require('../model/authModels')
});

module.exports = oauth;