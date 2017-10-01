/**
 * Created by Home Laptop on 01-Oct-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
    refreshToken: String,
    expiry: Date,
    scope:  String,
    User:  { type : Schema.Types.ObjectId, ref: 'User' },
    OAuthClient: { type : Schema.Types.ObjectId, ref: 'AuthClient' },
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);