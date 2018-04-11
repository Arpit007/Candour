/**
 * Created by StarkX on 09-Apr-18.
 */
const express = require('express');
const router = express.Router();

const authServer = require('../lib/express');
const model = require('../model/model');
const response = require('../response');

const error = (err, req, res, next) => {
    if (err) {
        return res.status(err.head.code).json(err);
    }
    next();
};

router.all('/oauth/token', authServer.token(), error);

router.post('/authorise', authServer.authorize(), error);

router.get('/client', (req, res) => {
    return model.AuthClient
        .findOne({
            clientId : req.query[ 'client_id' ],
            redirectUri : req.query[ 'redirect_uri' ],
        })
        .select("clientId name")
        .then((model) => {
            if (!model) return res.status(404).json(response.Response(404, 'Invalid Client'));
            return response.ResponseReply(res, 200, model);
        }).catch((err) => {
            return res.status(err.code || 500).json(response.Response(err.code || 500, err))
        });
});

module.exports = router;