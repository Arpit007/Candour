/**
 * Created by StarkX on 08-Apr-18.
 */
const error = require('./error');

class BearerToken {
    
    constructor(accessToken, accessTokenLifetime, refreshToken, scope, customAttributes) {
        if (!accessToken) throw new error.InvalidArgumentError('Missing parameter: `accessToken`');
        
        this.accessToken = accessToken;
        this.accessTokenLifetime = accessTokenLifetime;
        this.refreshToken = refreshToken;
        this.scope = scope;
        
        if (customAttributes)
            this.customAttributes = customAttributes;
    }
    
    // noinspection JSUnusedGlobalSymbols
    valueOf() {
        let object = {
            access_token : this.accessToken,
            token_type : 'Bearer'
        };
        
        if (this.accessTokenLifetime) object.expires_in = this.accessTokenLifetime;
        if (this.refreshToken) object.refresh_token = this.refreshToken;
        if (this.scope) object.scope = this.scope;
        
        for (let key in this.customAttributes) {
            if (this.customAttributes.hasOwnProperty(key))
                object[ key ] = this.customAttributes[ key ];
        }
        return object;
    }
}

module.exports = BearerToken;