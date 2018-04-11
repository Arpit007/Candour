/**
 * Created by StarkX on 08-Apr-18.
 */
const error = require('./error');
const Promise = require('bluebird');
const is = require('./validator');
const url = require('url');
const AuthenticateHandler = require('./authenticateHandler');

const responseTypes = {
    code : require('./codeResponse')
};

class AuthorizeHandler {
    
    constructor(options) {
        this.allowEmptyState = options.allowEmptyState;
        this.authenticateHandler = options.authenticateHandler || new AuthenticateHandler(options);
        this.authorizationCodeLifetime = options.authorizationCodeLifetime;
        this.model = options.model;
    }
    
    handle(request, response) {
        if ('false' === request.query[ 'allowed' ])
            return Promise.reject(new error.AccessDeniedError('Access denied: user denied access to application'));
        
        let fns = [
            this.getAuthorizationCodeLifetime(),
            this.getClient(request),
            this.getUser(request, response)
        ];
        
        return Promise.all(fns)
            .bind(this)
            .spread((expiresAt, client, user) => {
                let uri = this.getRedirectUri(request, client);
                let scope, state, ResponseType;
                
                return Promise.bind(this)
                    .then(() => {
                        scope = this.getScope(request);
                        return this.generateAuthorizationCode(client, user, scope);
                    })
                    .then((authorizationCode) => {
                        state = this.getState(request);
                        ResponseType = this.getResponseType(request);
                        return this.saveAuthorizationCode(authorizationCode, expiresAt, scope, client, uri, user);
                    })
                    .then((code) => {
                        let responseType = new ResponseType(code.authorizationCode);
                        let redirectUri = this.buildSuccessRedirectUri(uri, responseType);
                        this.updateResponse(response, redirectUri, state);
                        return code;
                    })
                    .catch((e) => {
                        if (!(e instanceof error.DefaultError))
                            e = error.ServerError(e);
                        let redirectUri = this.buildErrorRedirectUri(uri, e);
                        this.updateResponse(response, redirectUri, state);
                        throw e;
                    });
            });
    }
    
    generateAuthorizationCode(client, user, scope) {
        return this.model.generateAuthorizationCode(client, user, scope);
    }
    
    getAuthorizationCodeLifetime() {
        let expires = new Date();
        
        expires.setSeconds(expires.getSeconds() + this.authorizationCodeLifetime);
        return expires;
    }
    
    getClient(request) {
        let clientId = request.body[ 'client_id' ] || request.query[ 'client_id' ];
        
        if (!clientId)
            throw new error.InvalidRequestError('Missing parameter: `client_id`');
        
        if (!is.vschar(clientId))
            throw new error.InvalidRequestError('Invalid parameter: `client_id`');
        
        let redirectUri = request.body[ 'redirect_uri' ] || request.query[ 'redirect_uri' ];
        
        if (redirectUri && !is.uri(redirectUri))
            throw new error.InvalidRequestError('Invalid request: `redirect_uri` is not a valid URI');
        
        return this.model.getClient(clientId, null)
            .then((client) => {
                if (!client)
                    throw new error.InvalidClientError('Invalid client: client credentials are invalid');
                if (!client.grants)
                    throw new error.InvalidClientError('Invalid client: missing client `grants`');
                if (!client.grants.includes('authorization_code'))
                    throw new error.UnauthorizedClientError('Unauthorized client: `grant_type` is invalid');
                if (!client.redirectUris || 0 === client.redirectUris.length)
                    throw new error.InvalidClientError('Invalid client: missing client `redirectUri`');
                if (redirectUri && !client.redirectUris.includes(redirectUri))
                    throw new error.InvalidClientError('Invalid client: `redirect_uri` does not match client value');
                return client;
            });
    }
    
    // noinspection JSMethodCanBeStatic
    getScope(request) {
        let scope = request.body.scope || request.query.scope;
        if (!is.nqschar(scope))
            throw new error.InvalidScopeError('Invalid parameter: `scope`');
        //Todo: Scope as array
        scope = scope.split();
        return scope;
    }
    
    getState(request) {
        let state = request.body.state || request.query.state;
        
        if (!this.allowEmptyState && !state)
            throw new error.InvalidRequestError('Missing parameter: `state`');
        if (!is.vschar(state))
            throw new error.InvalidRequestError('Invalid parameter: `state`');
        
        return state;
    }
    
    getUser(request, response) {
        if (this.authenticateHandler instanceof AuthenticateHandler) {
            return this.authenticateHandler.handle(request, response).get('user');
        }
        return this.authenticateHandler.handle(request, response)
            .then((user) => {
                if (!user)
                    throw new error.ServerError('Server error: `handle()` did not return a `user` object');
                return user;
            });
    }
    
    // noinspection JSMethodCanBeStatic
    getRedirectUri(request, client) {
        return request.body[ 'redirect_uri' ] || request.query[ 'redirect_uri' ] || client.redirectUris[ 0 ];
    }
    
    saveAuthorizationCode(authorizationCode, expiresAt, scope, client, redirectUri, user) {
        let code = {
            authorizationCode : authorizationCode,
            expiresAt : expiresAt,
            redirectUri : redirectUri,
            scope : scope
        };
        return this.model.saveAuthorizationCode(code, client, user);
    }
    
    // noinspection JSMethodCanBeStatic
    getResponseType(request) {
        let responseType = request.body[ 'response_type' ] || request.query[ 'response_type' ];
        
        if (!responseType)
            throw new error.InvalidRequestError('Missing parameter: `response_type`');
        if (!(responseType in responseTypes))
            throw new error.UnsupportedResponseTypeError('Unsupported response type: `response_type` is not supported');
        
        return responseTypes[ responseType ];
    }
    
    // noinspection JSMethodCanBeStatic
    buildSuccessRedirectUri(redirectUri, responseType) {
        return responseType.buildRedirectUri(redirectUri);
    }
    
    // noinspection JSMethodCanBeStatic
    buildErrorRedirectUri(redirectUri, error) {
        let uri = url.parse(redirectUri);
        uri.query = {
            error : error.name
        };
        
        if (error.message)
            uri.query.error_description = error.message;
        return uri;
    }
    
    // noinspection JSMethodCanBeStatic
    updateResponse(response, redirectUri, state) {
        redirectUri.query = redirectUri.query || {};
        if (state)
            redirectUri.query.state = state;
        response.redirect(url.format(redirectUri));
    }
}

module.exports = AuthorizeHandler;