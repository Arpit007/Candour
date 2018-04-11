/**
 * Created by StarkX on 09-Apr-18.
 */
const Request = require('../lib/request');
const Response = require('../lib/response');
const oauth = require('../lib/oauth');
const model = require('../model/model');

module.exports = (app) => {
    app.all('/oauth/token', function (req, res, next) {
        let request = new Request(req);
        let response = new Response(res);
        
        oauth.token(request, response)
            .then((token) => {
                // Todo: remove unnecessary values in response
                return res.json(token)
            }).catch((err) => {
            return res.status(500).json(err)
        })
    });
    
    app.post('/authorise', function (req, res) {
        let request = new Request(req);
        let response = new Response(res);
        
        return oauth.authorize(request, response)
            .then((success) => {
                //  if (req.body.allow !== 'true') return callback(null, false);
                //  return callback(null, true, req.user);
                res.json(success)
            }).catch((err) => {
                res.status(err.code || 500).json(err)
            })
    });
    
    app.get('/authorise', (req, res) => {
        return model.AuthClient.findOne({
            clientId : req.query.client_id,
            redirectUri : req.query.redirect_uri,
        }).select("id name").then((model) => {
            if (!model) return res.status(404).json({ error : 'Invalid Client' });
            return res.json(model);
        }).catch((err) => {
            return res.status(err.code || 500).json(err)
        });
    });
};