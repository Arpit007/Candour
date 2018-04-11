/**
 * Created by StarkX on 08-Apr-18.
 */
const mongoose = require('mongoose');
const AuthClient = require('../schema/authClientSchema');

AuthClient.statics.getClient = (clientId, clientSecret) => {
    const options = { clientId : clientId };
    if (clientSecret) options.clientSecret = clientSecret;
    
    return AuthClientModel
        .findOne(options)
        .then((client) => {
            if (!client) return new Error("client not found");
            let clientWithGrants = client;
            clientWithGrants.grants = [ 'authorization_code', 'refresh_token' ];
            // Todo: need to create another table for redirect URIs
            clientWithGrants.redirectUris = [ clientWithGrants.redirectUri ];
            delete clientWithGrants.redirectUri;
            return clientWithGrants;
        }).catch((err) => {
            if (xConfig.debugMode)
                console.log("getClient - Err: ", err)
        });
};

module.exports = AuthClientModel = mongoose.model('AuthClient', AuthClient);