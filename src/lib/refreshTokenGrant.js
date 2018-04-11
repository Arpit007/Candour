/**
 * Created by StarkX on 08-Apr-18.
 */
const iGrant = require('./iGrant');
const error = require('./error');
const Promise = require('bluebird');
const is = require('./validator');

class RefreshTokenGrant extends iGrant {
    
    // noinspection JSUnusedGlobalSymbols
    handle(request, client) {
        return Promise.bind(this)
            .then(() => this.getRefreshToken(request, client))
            .tap((token) => this.revokeToken(token))
            .then((token) => this.saveToken(token.user, client, token.scope));
    }
    
    getRefreshToken(request, client) {
        if (!request.body.refresh_token)
            throw new error.InvalidRequestError('Missing parameter: `refresh_token`');
        
        if (!is.vschar(request.body.refresh_token))
            throw new error.InvalidRequestError('Invalid parameter: `refresh_token`');
        
        return this.model.getRefreshToken(request.body.refresh_token)
            .then((token) => {
                if (!token)
                    throw new error.InvalidGrantError('Invalid grant: refresh token is invalid');
                if (!token.client)
                    throw new error.ServerError('Server error: `getRefreshToken()` did not return a `client` object');
                if (!token.user)
                    throw new error.ServerError('Server error: `getRefreshToken()` did not return a `user` object');
                if (token.client.id !== client.id)
                    throw new error.InvalidGrantError('Invalid grant: refresh token is invalid');
                if (token.refreshTokenExpiresAt && !(token.refreshTokenExpiresAt instanceof Date))
                    throw new error.ServerError('Server error: `refreshTokenExpiresAt` must be a Date instance');
                if (token.refreshTokenExpiresAt && token.refreshTokenExpiresAt < new Date())
                    throw new error.InvalidGrantError('Invalid grant: refresh token has expired');
                
                return token;
            });
    }
    
    revokeToken(token) {
        if (this.alwaysIssueNewRefreshToken === false) {
            return Promise.resolve(token);
        }
        
        return this.model.revokeToken(token)
            .then((status) => {
                if (!status)
                    throw new error.InvalidGrantError('Invalid grant: refresh token is invalid');
                
                return token;
            });
    }
    
    saveToken(user, client, scope) {
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
                    accessTokenExpiresAt : accessTokenExpiresAt,
                    scope : scope
                };
                
                if (this.alwaysIssueNewRefreshToken !== false) {
                    token.refreshToken = refreshToken;
                    token.refreshTokenExpiresAt = refreshTokenExpiresAt;
                }
                
                return this.model.saveToken(token, client, user);
            });
    }
}

module.exports = RefreshTokenGrant;