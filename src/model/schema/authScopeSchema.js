/**
 * Created by StarkX on 08-Apr-18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AuthScopeSchema = new Schema({
    scope:  String,
    isDefault: Boolean
});

module.exports = AuthScopeSchema;