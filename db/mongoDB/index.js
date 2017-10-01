/**
 * Created by Home Laptop on 01-Oct-17.
 */
const mongoose = require('mongoose');
const oauthServer = require('oauth2-server');

mongoose.connect(global.config[ 'dB' ][ 'config' ][ 'url' ], function (err) {
    if (err)return console.log(err);
    console.log('MongoDB Successfully Connected');
});

const model = {
    AccessToken : require('./model/AccessToken'),
    AuthCode : require('./model/AuthCode'),
    AuthClient : require('./model/AuthClient'),
    RefreshToken : require('./model/RefreshToken'),
    AuthScope : require('./model/AuthScope'),
    User : require('./model/User'),
    Thing : require('./model/Thing')
};

global.model = model;

module.exports = new oauthServer({ model : require('./model/controller') });
