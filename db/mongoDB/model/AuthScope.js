/**
 * Created by Home Laptop on 01-Oct-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OAuthScopeSchema = new Schema({
    scope:  String,
    isDefault: Boolean
});

module.exports = mongoose.model('AuthScope', OAuthScopeSchema);