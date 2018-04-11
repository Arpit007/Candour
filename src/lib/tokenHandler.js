/**
 * Created by StarkX on 08-Apr-18.
 */
const error = require('./error');
const Promise = require('bluebird');
const TokenModel = require('./tokenModel');
const BearerToken = require('./bearerToken');
const is = require('./validator');
const auth = require('basic-auth');

let grantTypes = {
    authorization_code : require('./authCodeGrant'),
    refresh_token : require('./refreshTokenGrant')
};

class TokenHandler {
    
    constructor(options) {
        this.accessTokenLifetime = options.accessTokenLifetime;
        this.grantTypes = Object.assign({}, grantTypes, options[ 'extendedGrantTypes' ]);
        this.model = options.model;
        this.refreshTokenLifetime = options.refreshTokenLifetime;
        this.allowExtendedTokenAttributes = options.allowExtendedTokenAttributes;
        this.requireClientAuthentication = options.requireClientAuthentication || {};
        this.alwaysIssueNewRefreshToken = options.alwaysIssueNewRefreshToken !== false;
    }
    
    handle(request, response) {
        if (request.method !== 'POST')
            return Promise.reject(new error.InvalidRequestError('Invalid request: method must be POST'));
        
        if (!request.is('application/x-www-form-urlencoded'))
            return Promise.reject(new error.InvalidRequestError('Invalid request: content must be application/x-www-form-urlencoded'));
        
        return Promise.bind(this)
            .then(() => this.getClient(request, response))
            .then((client) => this.handleGrantType(request, client))
            .tap((data) => {
                let model = new TokenModel(data, { allowExtendedTokenAttributes : this.allowExtendedTokenAttributes });
                let tokenType = this.getTokenType(model);
                
                this.updateSuccessResponse(response, tokenType);
            }).catch((e) => {
                if (!(e instanceof error.DefaultError)) {
                    e = new error.ServerError(e);
                }
                
                this.updateErrorResponse(response, e);
                
                throw e;
            });
    }
    
    getClient(request, response) {
        let credentials = this.getClientCredentials(request);
        let grantType = request.body[ 'grant_type' ];
        
        if (!credentials.clientId)
            throw new error.InvalidRequestError('Missing parameter: `client_id`');
        if (this.isClientAuthenticationRequired(grantType) && !credentials.clientSecret)
            throw new error.InvalidRequestError('Missing parameter: `client_secret`');
        if (!is.vschar(credentials.clientId))
            throw new error.InvalidRequestError('Invalid parameter: `client_id`');
        if (credentials.clientSecret && !is.vschar(credentials.clientSecret))
            throw new error.InvalidRequestError('Invalid parameter: `client_secret`');
        
        return this.model.getClient(credentials.clientId, credentials.clientSecret)
            .then(function (client) {
                if (!client)
                    throw new error.InvalidClientError('Invalid client: client is invalid');
                if (!client.grants)
                    throw new error.ServerError('Server error: missing client `grants`');
                if (!(client.grants instanceof Array))
                    throw new error.ServerError('Server error: `grants` must be an array');
                
                return client;
            })
            .catch(function (e) {
                if ((e instanceof error.InvalidClientError) && request.get('authorization')) {
                    response.set('WWW-Authenticate', 'Basic realm="Service"');
                    throw new error.InvalidClientError(e, { code : 401 });
                }
                throw e;
            });
    }
    
    getClientCredentials(request) {
        let credentials = auth(request);
        let grantType = request.body[ 'grant_type' ];
        
        if (credentials)
            return { clientId : credentials[ 'name' ], clientSecret : credentials[ 'pass' ] };
        
        if (request.body[ 'client_id' ] && request.body[ 'client_secret' ])
            return { clientId : request.body[ 'client_id' ], clientSecret : request.body[ 'client_secret' ] };
        
        if (!this.isClientAuthenticationRequired(grantType)) {
            if (request.body[ 'client_id' ])
                return { clientId : request.body[ 'client_id' ] };
        }
        
        throw new error.InvalidClientError('Invalid client: cannot retrieve client credentials');
    }
    
    handleGrantType(request, client) {
        let grantType = request.body[ 'grant_type' ];
        
        if (!grantType)
            throw new error.InvalidRequestError('Missing parameter: `grant_type`');
        if (!is.nchar(grantType) && !is.uri(grantType))
            throw new error.InvalidRequestError('Invalid parameter: `grant_type`');
        if (!(grantType in grantTypes))
            throw new error.UnsupportedGrantTypeError('Unsupported grant type: `grant_type` is invalid');
        if (!client.grants.includes(grantType))
            throw new error.UnauthorizedClientError('Unauthorized client: `grant_type` is invalid');
        
        let accessTokenLifetime = this.getAccessTokenLifetime(client);
        let refreshTokenLifetime = this.getRefreshTokenLifetime(client);
        let Type = this.grantTypes[ grantType ];
        
        let options = {
            accessTokenLifetime : accessTokenLifetime,
            model : this.model,
            refreshTokenLifetime : refreshTokenLifetime,
            alwaysIssueNewRefreshToken : this.alwaysIssueNewRefreshToken
        };
        
        return new Type(options)
            .handle(request, client);
    }
    
    getAccessTokenLifetime(client) {
        return client.accessTokenLifetime || this.accessTokenLifetime;
    }
    
    getRefreshTokenLifetime(client) {
        return client.refreshTokenLifetime || this.refreshTokenLifetime;
    }
    
    // noinspection JSMethodCanBeStatic
    getTokenType(model) {
        return new BearerToken(model.accessToken, model.accessTokenLifetime,
            model.refreshToken, model.scope, model.customAttributes);
    }
    
    // noinspection JSMethodCanBeStatic
    updateSuccessResponse(response, tokenType) {
        response.body = tokenType.valueOf();
        
        response.set('Cache-Control', 'no-store');
        response.set('Pragma', 'no-cache');
    }
    
    // noinspection JSMethodCanBeStatic
    updateErrorResponse(response, error) {
        response.body = {
            error : error.name,
            error_description : error.message
        };
        
        response.status = error.code;
    }
    
    isClientAuthenticationRequired(grantType) {
        if (Object.keys(this.requireClientAuthentication).length > 0) {
            return (typeof this.requireClientAuthentication[ grantType ] !== 'undefined')
                ? this.requireClientAuthentication[ grantType ] : true;
        }
        else return true;
    }
}

module.exports = TokenHandler;