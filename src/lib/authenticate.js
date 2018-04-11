/**
 * Created by StarkX on 09-Apr-18.
 */
const Request = require('./request');
const Response = require('./response');
const oauth = require('./oauth');

module.exports = function (options) {
    options = options || {};
    return (req, res, next) => {
        let request = new Request({
            headers : { authorization : req.headers.authorization },
            method : req.method,
            query : req.query,
            body : req.body
        });
        let response = new Response(res);
        
        oauth.authenticate(request, response, options)
            .then((token) => {
                req.user = token;
                next()
            })
            .catch((err) => {
                res.status(err.code || 500).json(err)
            });
    }
};