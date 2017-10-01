/**
 * Created by Home Laptop on 01-Oct-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccessTokenSchema = new Schema({
    accessToken: String,
    expiry: Date,
    scope:  String,
    User:  { type : Schema.Types.ObjectId, ref: 'User' },
    AuthClient : { type : Schema.Types.ObjectId, ref : 'AuthClient' },
});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);