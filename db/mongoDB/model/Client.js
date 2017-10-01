/**
 * Created by Home Laptop on 01-Oct-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OAuthClientSchema = new Schema({
    name : String,
    clientId : String,
    clientSecret : String,
    redirectUri : String,
    grantTypes : String,
    scope : String,
    User : { type : Schema.Types.ObjectId, ref : 'User' },
});

module.exports = mongoose.model('AuthClient', OAuthClientSchema);