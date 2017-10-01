/**
 * Created by Home Laptop on 01-Oct-17.
 */
const oauthServer = require('oauth2-server');
const Request = oauthServer.Request;
const Response = oauthServer.Response;

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
        
        authServer.authenticate(request, response, options)
            .then(function (token) {
                req.user = token;
                next()
            }).catch(function (err) {
                res.status(err.code || 500).json(err)
            });
    }
};