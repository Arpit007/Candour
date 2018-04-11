/**
 * Created by StarkX on 08-Apr-18.
 */
const mongoose = require('mongoose');
const AuthScope = require('../schema/authScopeSchema');

AuthScope.statics.validateScope = (user, client, scope) => {
    return Promise.resolve({})
        .then(() => {
            return scope;
        });
    // return (user.scope === client.scope) ? scope : false;
};

AuthScope.statics.verifyScope = (token, scope) => {
    return Promise.resolve({})
        .then(() => {
            return scope;
        });
    //return token.scope === scope;
};

module.exports = ScopeModel = mongoose.model('AuthScope', AuthScope);