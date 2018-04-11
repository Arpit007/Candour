/**
 * Created by StarkX on 08-Apr-18.
 */
const error = require('./error');
const Promise = require('bluebird');

class AuthenticateHandler {
    
    constructor(options) {
        options = options || {};
        
        //Todo: Check
        if (options.scope && !options.model.verifyScope)
            throw new error.InvalidArgumentError('Invalid argument: model does not implement `verifyScope()`');
        
        this.addAcceptedScopesHeader = options.addAcceptedScopesHeader;
        this.addAuthorizedScopesHeader = options.addAuthorizedScopesHeader;
        this.allowBearerTokensInQueryString = options.allowBearerTokensInQueryString;
        this.model = options.model;
        this.scope = options.scope;
    }
    
    handle(request, response) {
        
        return Promise.bind(this)
            .then(() => this.getTokenFromRequest(request))
            .then((token) => this.getAccessToken(token))
            .tap((token) => this.validateAccessToken(token))
            .tap((token) => {
                if (this.scope)
                    return this.verifyScope(token);
            })
            .tap((token) => this.updateResponse(response, token))
            .catch(function (e) {
                if (e instanceof error.UnauthorizedRequestError)
                    response.set('WWW-Authenticate', 'Bearer realm="Service"');
                
                if (!(e instanceof error.DefaultError))
                    throw new error.ServerError(e);
                throw e;
            });
    }
    
    getTokenFromRequest(request) {
        let headerToken = request.get('Authorization');
        let queryToken = request.query.access_token;
        let bodyToken = request.body.access_token;
        
        if (!!headerToken + !!queryToken + !!bodyToken > 1)
            throw new error.InvalidRequestError('Invalid request: only one authentication method is allowed');
        
        if (headerToken) return this.getTokenFromRequestHeader(request);
        if (queryToken) return this.getTokenFromRequestQuery(request);
        if (bodyToken) return this.getTokenFromRequestBody(request);
        
        throw new error.UnauthorizedRequestError('Unauthorized request: no authentication given');
    }
    
    // noinspection JSMethodCanBeStatic
    getTokenFromRequestHeader(request) {
        let token = request.get('Authorization');
        let matches = token.match(/Bearer\s(\S+)/);
        
        if (!matches)
            throw new error.InvalidRequestError('Invalid request: malformed authorization header');
        return matches[ 1 ];
    };
    
    getTokenFromRequestQuery(request) {
        if (!this.allowBearerTokensInQueryString)
            throw new error.InvalidRequestError('Invalid request: do not send bearer tokens in query URLs');
        return request.query.access_token;
    };
    
    // noinspection JSMethodCanBeStatic
    getTokenFromRequestBody(request) {
        if (request.method === 'GET')
            throw new error.InvalidRequestError('Invalid request: token may not be passed in the body when using the GET verb');
        
        if (!request.is('application/x-www-form-urlencoded'))
            throw new error.InvalidRequestError('Invalid request: content must be application/x-www-form-urlencoded');
        
        return request.body.access_token;
    }
    
    getAccessToken(token) {
        return this.model.getAccessToken(token)
            .then((accessToken) => {
                if (!accessToken)
                    throw new error.InvalidTokenError('Invalid token: access token is invalid');
                
                if (!accessToken.user)
                    throw new error.ServerError('Server error: `getAccessToken()` did not return a `user` object');
                
                return accessToken;
            });
    }
    
    // noinspection JSMethodCanBeStatic
    validateAccessToken(accessToken) {
        if (!(accessToken.accessTokenExpiresAt instanceof Date))
            throw new error.ServerError('Server error: `accessTokenExpiresAt` must be a Date instance');
        
        if (accessToken.accessTokenExpiresAt < new Date())
            throw new error.InvalidTokenError('Invalid token: access token has expired');
        
        return accessToken;
    }
    
    verifyScope(accessToken) {
        return this.model.verifyScope(accessToken, this.scope)
            .then((scope) => {
                if (!scope)
                    throw new error.InsufficientScopeError('Insufficient scope: authorized scope is insufficient');
                return scope;
            });
    }
    
    updateResponse(response, accessToken) {
        if (this.scope && this.addAcceptedScopesHeader)
            response.set('X-Accepted-OAuth-Scopes', this.scope);
        
        if (this.scope && this.addAuthorizedScopesHeader)
            response.set('X-OAuth-Scopes', accessToken.scope);
    }
}

module.exports = AuthenticateHandler;