/**
 * Created by StarkX on 11-Apr-18.
 */
const oauthServer = require('./server');
const Request = require('./request');
const Response = require('./response');
const reply = require('../response');

const server = module.exports.server = new oauthServer({
    model : require('../model/authModels')
});


module.exports.authenticate = (options) => {
    return (req, res, next) => {
        let request = new Request(req);
        let response = new Response(res);
        return server.authenticate(request, response, options)
            .then((token) => {
                req.user = token.user;
                res.locals.oauth = { token : token };
                next();
            })
            .catch((e) => next(e));
    };
};

module.exports.authorize = (options, onSuccess) => {
    return (req, res, next) => {
        let request = new Request(req);
        let response = new Response(res);
        
        return server.authorize(request, response, options)
            .then((code) => {
                req.user = code.user;
                res.locals.oauth = { code : code };
                if (onSuccess) onSuccess(req, res);
            })
            .then(() => handleResponse.call(this, req, res, response))
            .catch((e) => next(e));
    };
};

module.exports.token = (options, onSuccess) => {
    return (req, res, next) => {
        let request = new Request(req);
        let response = new Response(res);
        
        return server.token(request, response, options)
            .then((token) => {
                req.user = token.user;
                res.locals.oauth = { token : token };
                if (onSuccess) onSuccess(req, res);
            })
            .then(() => handleResponse.call(this, req, res, response))
            .catch((e) => next(e));
    };
};

const handleResponse = (req, res, response) => {
    if (response.status === 302) {
        let location = response.headers.location;
        delete response.headers.location;
        res.set(response.headers);
        res.redirect(location);
    } else {
        res.set(response.headers);
        res.status(response.status)
            .json(reply.Response(response.status, response.body));
    }
};