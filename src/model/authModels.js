/**
 * Created by StarkX on 08-Apr-18.
 */
const model = require('./model');

module.exports = {
    getAccessToken : model.Token.getAccessToken,
    getAuthorizationCode : model.AuthCode.getCode,
    getClient : model.AuthClient.getClient,
    getRefreshToken : model.Token.getRefreshToken,
    getUser : model.User.getUser,
    revokeAuthorizationCode : model.AuthCode.revokeCode,
    revokeToken : model.Token.revokeToken,
    saveToken : model.Token.saveToken,
    saveAuthorizationCode : model.AuthCode.saveCode,
    validateScope : model.AuthScope.validateScope,
    generateRefreshToken : model.Token.generate,
    generateAccessToken : model.Token.generate,
    generateAuthorizationCode : model.AuthCode.generate,
    verifyScope : model.AuthScope.verifyScope
};