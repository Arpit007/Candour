/**
 * Created by Home Laptop on 08-Apr-18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AuthCodeSchema = new Schema({
    authCode : { type : String, required : true, unique : true },
    expires : Date,
    scope : [ { type : String } ],
    User : { type : ObjectId, ref : 'User' },
    AuthClient : { type : ObjectId, ref : 'AuthClient' }
});

module.exports = AuthCodeSchema;