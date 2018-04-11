/**
 * Created by StarkX on 08-Apr-18.
 */
const error = require('./error');
const typeIs = require('type-is');

class Request {
    
    constructor(options) {
        options = options || {};
        
        if (!options.headers)
            throw new error.InvalidArgumentError('Missing parameter: `headers`');
        
        if (!options.method)
            throw new error.InvalidArgumentError('Missing parameter: `method`');
        
        if (!options.query)
            throw new error.InvalidArgumentError('Missing parameter: `query`');
        
        this.body = options.body || {};
        this[ 'headers' ] = {};
        this[ 'method' ] = options.method;
        this.query = options.query;
        
        for (let field in options.headers) {
            if (options.headers.hasOwnProperty(field)) {
                this[ 'headers' ][ field.toLowerCase() ] = options.headers[ field ];
            }
        }
        
        for (let property in options) {
            if (options.hasOwnProperty(property) && !this[ property ]) {
                this[ property ] = options[ property ];
            }
        }
    }
    
    get(field) {
        return this[ 'headers' ][ field.toLowerCase() ];
    };
    
    is(types) {
        if (!Array.isArray(types))
            types = [].slice.call(arguments);
        return typeIs(this, types) || false;
    }
}

module.exports = Request;