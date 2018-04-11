/**
 * Created by StarkX on 08-Apr-18.
 */
const error = require('./error');
const validator = require('./validator');

class iGrant {
    constructor(options) {
        options = options || {};
        
        if (!options.accessTokenLifetime)
            throw new error.InvalidArgumentError('Missing parameter: `accessTokenLifetime`');
        
        this.model = options.model;
        this.accessTokenLifetime = options.accessTokenLifetime;
        this.refreshTokenLifetime = options.refreshTokenLifetime;
        this.alwaysIssueNewRefreshToken = options.alwaysIssueNewRefreshToken;
    }
    
    // noinspection JSUnusedGlobalSymbols
    static getScope(request) {
        if (!validator.nqschar(request.body.scope))
            throw new error.InvalidArgumentError('Invalid parameter: `scope`');
        return request.body.scope;
    }
    
    generateAccessToken(client, user, scope) {
        return this.model.generateAccessToken(client, user, scope);
    }
    
    generateRefreshToken(client, user, scope) {
        return this.model.generateRefreshToken(client, user, scope);
    }
    
    getAccessTokenExpiresAt() {
        let expires = new Date();
        expires.setSeconds(expires.getSeconds() + this.accessTokenLifetime);
        return expires;
    }
    
    getRefreshTokenExpiresAt() {
        let expires = new Date();
        expires.setSeconds(expires.getSeconds() + this.refreshTokenLifetime);
        return expires;
    }
    
    validateScope(user, client, scope) {
        return this.model.validateScope(user, client, scope)
            .then((scope) => {
                if (!scope)
                    throw new error.InvalidScopeError('Invalid scope: Requested scope is invalid');
                return scope;
            });
    }
}

module.exports = iGrant;
