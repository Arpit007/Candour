/**
 * Created by Home Laptop on 08-Apr-18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TokenSchema = new Schema({
    accessToken : String,
    accessTokenExpiresAt : Date,
    refreshToken : String,
    refreshTokenExpiresAt : Date,
    scope : [ { type : String } ],
    user : { type : ObjectId, ref : 'User' },
    client : { type : ObjectId, ref : 'AuthClient' },
});

module.exports = TokenSchema;