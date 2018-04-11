/**
 * Created by Home Laptop on 08-Apr-18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let mongooseHidden = require('mongoose-hidden')();
const grantTypes = [ 'authorization_code', 'refresh_token' ];

//Todo: Generate Client ID
const AuthClientSchema = new Schema({
    name : String,
    clientId : { type : String, required : true },
    clientSecret : { type : String, required : true, hideJSON : true },
    redirectUri : String,
    grantTypes : { type : String, enum : grantTypes },
    scope : [ { type : String } ]
});

AuthClientSchema.grantTypes = grantTypes;
AuthClientSchema.plugin(mongooseHidden);

module.exports = AuthClientSchema;