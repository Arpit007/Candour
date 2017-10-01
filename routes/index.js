/**
 * Created by Home Laptop on 01-Oct-17.
 */
const express = require('express');
const router = express.Router();
const oauthServer = require('oauth2-server');
const Request = oauthServer.Request;
const Response = oauthServer.Response;

router.get('/', function(req, res, next) {
    res.render('index', { title : config[ 'appName' ] });
});

router.all('/oauth/token', (req, res, next) => {
    const request = new Request(req);
    const response = new Response(res);
    
    authServer.token(request, response)
        .then((token) => {
            // Todo: remove unnecessary values in response
            return res.json(token)
        })
        .catch((err) => {
            return res.status(500).json(err)
        });
});

router.post('/authorise', (req, res) => {
    const request = new Request(req);
    const response = new Response(res);
    
    return authServer.authorize(request, response)
        .then((success) => {
            //  if (req.body.allow !== 'true') return callback(null, false);
            //  return callback(null, true, req.user);
            res.json(success)
        }).catch((err) => {
            res.status(err.code || 500).json(err)
        });
});

router.get('/authorise', (req, res) => {
    return model.AuthClient.findOne({
        where : {
            clientId : req.query.clientId,
            redirectUri : req.query.redirectUri,
        },
        attributes : [ 'id', 'name' ],
    }).then((model) => {
        if (!model) return res.status(404).json({ error : 'Invalid Client' });
        return res.json(model);
    }).catch((err) => {
        return res.status(err.code || 500).json(err)
    });
});

module.exports = router;