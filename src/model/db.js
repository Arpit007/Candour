/**
 * Created by StarkX on 07-Mar-18.
 */
const mongoose = require('mongoose');
const promise = require('bluebird');

mongoose.Promise = promise;
mongoose.connect(`${xConfig.dbConfig.url}/${xConfig.dbConfig.db}`).then(() => {
});

mongoose.connection.on('connected', () => console.log('Mongoose connected'));

mongoose.connection.on('error', (err) => console.log('Mongoose connection error: ' + err));

mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

module.exports = require('./model');