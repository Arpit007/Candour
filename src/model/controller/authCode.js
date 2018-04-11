/**
 * Created by StarkX on 08-Apr-18.
 */
const mongoose = require('mongoose');
const AuthCode = require('../schema/authCodeSchema');
const tokenGenerator = require('../../lib/tokenGenerator');

AuthCode.statics.revokeCode = (code) => {
    return AuthCodeModel.findOne({ authCode : code.code })
        .then((rCode) => {
            if (rCode) return rCode.remove();
        }).then(() => {
            let expiredCode = code;
            expiredCode.expiresAt = new Date('1996-05-9T06:59:53.000Z');
            return expiredCode;
        }).catch((err) => {
            if (xConfig.debugMode)
                console.log("getUser - Err: ", err)
        });
};

AuthCode.statics.getCode = (code) => {
    return AuthCodeModel
        .findOne({ authCode : code })
        .populate('User')
        .populate('AuthClient')
        .then((authCodeModel) => {
            if (!authCodeModel) return false;
            return {
                code : code,
                client : authCodeModel.AuthClient,
                expiresAt : authCodeModel.expires,
                redirectUri : authCodeModel.AuthClient.redirectUri,
                user : authCodeModel.User,
                scope : authCodeModel.scope,
            };
        }).catch((err) => {
            if (xConfig.debugMode)
                console.log("getAuthorizationCode - Err: ", err)
        });
};

AuthCode.statics.saveCode = (code, client, user) => {
    return AuthCodeModel
        .create({
            expires : code.expiresAt,
            AuthClient : client._id,
            authCode : code.authorizationCode,
            User : user._id,
            scope : code.scope
        }).then(() => {
            code.code = code.authCode;
            return code
        }).catch((err) => {
            if (xConfig.debugMode)
                console.log("saveAuthorizationCode - Err: ", err)
        });
};

AuthCode.statics.generate = (client, user, scope) => {
    return tokenGenerator();
};

module.exports = AuthCodeModel = mongoose.model('AuthCode', AuthCode);