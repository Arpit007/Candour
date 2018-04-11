/**
 * Created by StarkX on 08-Apr-18.
 */
const url = require('url');
const error = require('./error');

class CodeResponse {
    constructor(code) {
        if (!code) throw new error.InvalidArgumentError('Missing parameter: `code`');
        this.code = code;
    }
    
    buildRedirectUri(redirectUri) {
        if (!redirectUri)
            throw new error.InvalidArgumentError('Missing parameter: `redirectUri`');
        let uri = url.parse(redirectUri, true);
        
        uri.query.code = this.code;
        uri.search = null;
        
        return uri;
    }
}

module.exports = CodeResponse;