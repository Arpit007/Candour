/**
 * Created by Home Laptop on 01-Oct-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthCodeSchema = new Schema({
    AuthCode: String,
    expiry: Date,
    redirectUri:  String,
    scope:  String,
    User:  { type : Schema.Types.ObjectId, ref: 'User' },
    OAuthClient: { type : Schema.Types.ObjectId, ref: 'AuthClient' },
});

module.exports = mongoose.model('AuthCode', AuthCodeSchema);
