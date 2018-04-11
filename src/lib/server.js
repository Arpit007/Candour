/**
 * Created by StarkX on 08-Apr-18.
 */
const error = require('./error');
const AuthenticateHandler = require('./authenticateHandler');
const AuthorizeHandler = require('./authorizeHandler');
const TokenHandler = require('./tokenHandler');

class Server {
    constructor(options) {
        options = options || {};
        
        if (!options.model)
            throw new error.InvalidArgumentError('Missing parameter: `model`');
        
        this.options = options;
    }
    
    authenticate(request, response, options, callback) {
        if (typeof options === 'string')
            options = { scope : options };
        
        options = Object.assign({
            addAcceptedScopesHeader : true,
            addAuthorizedScopesHeader : true,
            allowBearerTokensInQueryString : false
        }, this.options, options);
        
        return new AuthenticateHandler(options)
            .handle(request, response)
            .nodeify(callback);
    }
    
    authorize(request, response, options, callback) {
        options = Object.assign({
            allowEmptyState : false,
            authorizationCodeLifetime : xConfig.auth.authorizationCodeLifetime
        }, this.options, options);
        
        return new AuthorizeHandler(options)
            .handle(request, response)
            .nodeify(callback);
    }
    
    token(request, response, options, callback) {
        options = Object.assign({
            accessTokenLifetime : xConfig.auth.accessTokenLifetime,
            refreshTokenLifetime : xConfig.auth.refreshTokenLifetime,
            allowExtendedTokenAttributes : false,
            requireClientAuthentication : {}           // defaults to true for all grant types
        }, this.options, options);
        
        return new TokenHandler(options)
            .handle(request, response)
            .nodeify(callback);
    }
}

module.exports = Server;