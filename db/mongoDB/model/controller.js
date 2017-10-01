/**
 * Created by Home Laptop on 01-Oct-17.
 */
const _ = require('lodash');

const User = dB.User;
const AuthClient = dB.AuthClient;
const AccessToken = dB.AccessToken;
const AuthCode = dB.AuthCode;
const RefreshToken = dB.RefreshToken;

function getAccessToken(bearerToken) {
    return AccessToken
        .findOne({ accessToken : bearerToken })
        .populate('User')
        .populate('AuthClient')
        .then((accessToken) => {
            if (!accessToken) return false;
            let token = accessToken;
            token.user = token.User;
            token.client = token.AuthClient;
            return token;
        })
        .catch((err) => {
            console.log("getAccessToken - Err: ")
        });
}

function getClient(clientId, clientSecret) {
    const options = { clientId : clientId };
    if (clientSecret) options.clientSecret = clientSecret;
    
    return AuthClient
        .findOne(options)
        .then((client) => {
            if (!client) return new Error("client not found");
            let clientWithGrants = client;
            clientWithGrants.grants = [ 'authorization_code', 'password', 'refresh_token', 'client_credentials' ];
            // Todo: need to create another table for redirect URIs
            clientWithGrants.redirectUris = [ clientWithGrants.redirectUri ];
            delete clientWithGrants.redirectUri;
            //clientWithGrants.refreshTokenLifetime = integer optional
            //clientWithGrants.accessTokenLifetime  = integer optional
            return clientWithGrants;
        }).catch((err) => {
            console.log("getClient - Err: ", err)
        });
}

function getUser(username, password) {
    return User
        .findOne({ username : username })
        .then((user) => {
            return user.password === password ? user : false;
        }).catch((err) => {
            console.log("getUser - Err: ", err)
        });
}

function revokeAuthorizationCode(code) {
    return AuthCode.findOne({
        where : {
            authCode : code.code
        }
    }).then((rCode) => {
        let expiredCode = code;
        expiredCode.expiresAt = new Date('2015-05-28T06:59:53.000Z');
        return expiredCode
    }).catch((err) => {
        console.log("getUser - Err: ", err)
    });
}

function revokeToken(token) {
    return RefreshToken.findOne({
        where : {
            refreshToken : token.refreshToken
        }
    }).then((rT) => {
        if (rT) rT.destroy();
        let expiredToken = token;
        expiredToken.refreshTokenExpiresAt = new Date('2015-05-28T06:59:53.000Z');
        return expiredToken;
    }).catch((err) => {
        console.log("revokeToken - Err: ", err)
    });
}

function saveToken(token, client, user) {
    return Promise.all([
        AccessToken.create({
            accessToken : token.accessToken,
            expiry : token.accessTokenExpiresAt,
            AuthClient : client._id,
            User : user._id,
            scope : token.scope
        }),
        token.refreshToken ? RefreshToken.create({ // no refresh token for client_credentials
            refreshToken : token.refreshToken,
            expiry : token.refreshTokenExpiresAt,
            AuthClient : client._id,
            User : user._id,
            scope : token.scope
        }) : []
    ]).then((resultsArray) => {
        return _.assign({
            client : client,
            user : user,
            accessToken : token.accessToken, // proxy
            refreshToken : token.refreshToken, // proxy
        }, token);
    }).catch((err) => {
        console.log("revokeToken - Err: ", err)
    });
}


function getAuthorizationCode(code) {
    return AuthCode
        .findOne({ authCode : code })
        .populate('User')
        .populate('AuthClient')
        .then((authCodeModel) => {
            if (!authCodeModel) return false;
            let client = authCodeModel.AuthClient;
            let user = authCodeModel.User;
            return reCode = {
                code : code,
                client : client,
                expiresAt : authCodeModel.expiry,
                redirectUri : client.redirectUri,
                user : user,
                scope : authCodeModel.scope,
            };
        }).catch((err) => {
            console.log("getAuthorizationCode - Err: ", err)
        });
}

function saveAuthorizationCode(code, client, user) {
    return AuthCode
        .create({
            expiry : code.expiresAt,
            AuthClient : client._id,
            authCode : code.AuthCode,
            User : user._id,
            scope : code.scope
        }).then(() => {
            code.code = code.AuthCode;//or authCode
            return code
        }).catch((err) => {
            console.log("saveAuthorizationCode - Err: ", err)
        });
}

function getUserFromClient(client) {
    let options = { clientId : client.clientId };
    if (client.clientSecret) options.clientSecret = client.clientSecret;
    
    return AuthClient
        .findOne(options)
        .populate('User')
        .then((client) => {
            if (!client || !client.User) return false;
            return client.User;
        }).catch((err) => {
            console.log("getUserFromClient - Err: ", err)
        });
}

function getRefreshToken(refreshToken) {
    if (!refreshToken || refreshToken === 'undefined') return false;
    return RefreshToken
        .findOne({ refreshToken : refreshToken })
        .populate('User')
        .populate('AuthClient')
        .then((savedRT) => {
            return tokenTemp = {
                user : savedRT ? savedRT.User : {},
                client : savedRT ? savedRT.AuthClient : {},
                refreshTokenExpiresAt : savedRT ? new Date(savedRT.expiry) : null,
                refreshToken : refreshToken,
                scope : savedRT.scope
            };
        }).catch((err) => {
            console.log("getRefreshToken - Err: ", err)
        });
}

function validateScope(token, client, scope) {
    return (user.scope === client.scope) ? scope : false
}

function verifyScope(token, scope) {
    return token.scope === scope
}

module.exports = {
    getAccessToken : getAccessToken,
    getAuthorizationCode : getAuthorizationCode,
    getClient : getClient,
    getRefreshToken : getRefreshToken,
    getUser : getUser,
    getUserFromClient : getUserFromClient,
    revokeAuthorizationCode : revokeAuthorizationCode,
    revokeToken : revokeToken,
    saveToken : saveToken,
    saveAuthorizationCode : saveAuthorizationCode,
    verifyScope : verifyScope,
};