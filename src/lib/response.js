/**
 * Created by StarkX on 08-Apr-18.
 */

class Response {
    constructor(options) {
        options = options || {};
        
        this[ 'body' ] = options.body || {};
        this[ 'headers' ] = {};
        this[ 'status' ] = 200;
        
        for (let field in options.headers) {
            if (options.headers.hasOwnProperty(field))
                this[ 'headers' ][ field.toLowerCase() ] = options.headers[ field ];
        }
        
        for (let property in options) {
            if (options.hasOwnProperty(property) && !this[ property ])
                this[ property ] = options[ property ];
        }
    }
    
    get(field) {
        return this[ 'headers' ][ field.toLowerCase() ];
    };
    
    set(field, value) {
        this[ 'headers' ][ field.toLowerCase() ] = value;
    }
    
    redirect(url) {
        this.set('Location', url);
        this[ 'status' ] = 302;
    }
}

module.exports = Response;