/**
 * Created by Home Laptop on 01-Oct-17.
 */
const config = require('../../config/config');
const mongoose = require('mongoose');

mongoose.connect(config[ 'dB' ][ 'config' ][ 'url' ], function (err) {
    if (err)return console.log(err);
    console.log('MongoDB Successfully Connected');
});

const dB = {
    AccessToken : require('./model/AccessToken'),
    AuthCode : require('./model/AuthCode'),
    AuthClient : require('./model/AuthClient'),
    RefreshToken : require('./model/RefreshToken'),
    AuthScope : require('./model/AuthScope'),
    User : require('./model/User'),
    Thing : require('./model/Thing')
};

global.dB = dB;
dB.methods = require('./model/controller');

module.exports = dB;