/**
 * Created by StarkX on 08-Apr-18.
 */
const mongoose = require('mongoose');
const Token = require('../schema/tokenSchema');
const tokenGenerator = require('../../lib/tokenGenerator');

Token.statics.getAccessToken = (bearerToken) => {
    return tokenModel
        .findOne({ accessToken : bearerToken })
        .populate('user')
        .populate('client')
        .catch((err) => {
            if (xConfig.debugMode)
                console.log("getAccessToken - Err: ", err);
        });
};

Token.statics.generate = (client, user, scope) => {
    return tokenGenerator();
};

Token.statics.revokeToken = (token) => {
    return tokenModel.findOne({ refreshToken : token.refreshToken })
        .then((rT) => {
            if (rT) return rT.remove();
        })
        .then(() => {
            let expiredToken = token;
            expiredToken.refreshTokenExpiresAt = new Date('1996-05-9T06:59:53.000Z');
            return expiredToken;
        }).catch((err) => {
            if (xConfig.debugMode)
                console.log("revokeToken - Err: ", err)
        });
};

Token.statics.getRefreshToken = (refreshToken) => {
    return tokenModel
        .findOne({ refreshToken : refreshToken })
        .populate('user')
        .populate('client')
        .then((token) => {
            if (!token) return false;
            token.refresh_token = token.refreshToken;
            return token;
        }).catch((err) => {
            if (xConfig.debugMode)
                console.log("getRefreshToken - Err: ", err)
        });
};

Token.statics.saveToken = (token, client, user) => {
    return tokenModel.create({
        accessToken : token.accessToken,
        accessTokenExpiresAt : token.accessTokenExpiresAt,
        refreshToken : token.refreshToken,
        refreshTokenExpiresAt : token.refreshTokenExpiresAt,
        client : client._id,
        user : user._id,
        scope : token.scope
    }).then(() => {
        return Object.assign({
            client : client,
            user : user,
            accessToken : token.accessToken,
            refreshToken : token.refreshToken,
        }, token);
    }).catch((err) => {
        if (xConfig.debugMode)
            console.log("revokeToken - Err: ", err)
    });
};

module.exports = tokenModel = mongoose.model('Token', Token);