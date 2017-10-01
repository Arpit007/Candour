/**
 * Created by Home Laptop on 01-Oct-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : String,
    password : String,
    scope : String
});

module.exports = mongoose.model('User', UserSchema);