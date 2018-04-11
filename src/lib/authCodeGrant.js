/**
 * Created by StarkX on 08-Apr-18.
 */
const Promise = require('bluebird');
const iGrant = require('./iGrant');
const error = require('./error');
const is = require('./validator');

class AuthCodeGrant extends iGrant {
    
    // noinspection JSUnusedGlobalSymbols
    handle(request, client) {
        return Promise.bind(this)
            .then(() => this.getAuthorizationCode(request, client))
            .tap((code) => this.validateRedirectUri(request, code))
            .tap((code) => this.revokeAuthorizationCode(code))
            .then((code) => this.saveToken(code.user, client, code.authorizationCode, code.scope));
    }
    
    getAuthorizationCode(request, client) {
        if (!request.body.code)
            throw new error.InvalidRequestError('Missing parameter: `code`');
        
        if (!is.vschar(request.body.code))
            throw new error.InvalidRequestError('Invalid parameter: `code`');
        
        return this.model.getAuthorizationCode(request.body.code)
            .then((code) => {
                if (!code) throw new error.InvalidGrantError('Invalid grant: authorization code is invalid');
                if (!code.client) throw new error.ServerError('Server error: `getAuthorizationCode()` did not return a `client` object');
                if (!code.user) throw new error.ServerError('Server error: `getAuthorizationCode()` did not return a `user` object');
                if (code.client.id !== client.id) throw new error.InvalidGrantError('Invalid grant: authorization code is invalid');
                if (!(code.expiresAt instanceof Date)) throw new error.ServerError('Server error: `expiresAt` must be a Date instance');
                if (code.expiresAt < new Date()) throw new error.InvalidGrantError('Invalid grant: authorization code has expired');
                if (code.redirectUri && !is.uri(code.redirectUri)) throw new error.InvalidGrantError('Invalid grant: `redirect_uri` is not a valid URI');
                
                return code;
            });
    }
    
    // noinspection JSMethodCanBeStatic
    validateRedirectUri(request, code) {
        if (!code.redirectUri)
            return;
        
        let redirectUri = request.body[ 'redirect_uri' ] || request.query[ 'redirect_uri' ];
        
        if (!is.uri(redirectUri)) throw new error.InvalidRequestError('Invalid request: `redirect_uri` is not a valid URI');
        if (redirectUri !== code.redirectUri) throw new error.InvalidRequestError('Invalid request: `redirect_uri` is invalid');
    }
    
    revokeAuthorizationCode(code) {
        return this.model.revokeAuthorizationCode(code)
            .then((status) => {
                if (!status)
                    throw new error.InvalidGrantError('Invalid grant: authorization code is invalid');
                
                return code;
            });
    }
    
    saveToken(user, client, authorizationCode, scope) {
        let fns = [
            this.validateScope(user, client, scope),
            this.generateAccessToken(client, user, scope),
            this.generateRefreshToken(client, user, scope),
            this.getAccessTokenExpiresAt(),
            this.getRefreshTokenExpiresAt()
        ];
        
        return Promise.all(fns)
            .bind(this)
            .spread((scope, accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt) => {
                let token = {
                    accessToken : accessToken,
                    authorizationCode : authorizationCode,
                    accessTokenExpiresAt : accessTokenExpiresAt,
                    refreshToken : refreshToken,
                    refreshTokenExpiresAt : refreshTokenExpiresAt,
                    scope : scope
                };
                
                return this.model.saveToken(token, client, user);
            });
    }
}

module.exports = AuthCodeGrant;