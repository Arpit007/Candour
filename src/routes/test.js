/**
 * Created by Home Laptop on 11-Apr-18.
 */
const express = require('express');
const router = express.Router();
const authServer = require('../lib/express');
const response = require('../response');

const error = (err, req, res, next) => {
    if (err) {
        return res.status(err.head.code).json(err);
    }
    next();
};

router.get('/secure', authServer.authenticate(), (req, res) => {
    res.json({ message : 'Secure data' })
}, error);

router.get('/me', authServer.authenticate(), (req, res) => {
    res.json({
        me : req.user,
        messsage : 'Authorization success, Without Scopes, Try accessing /profile with `profile` scope',
        description : 'Try postman https://www.getpostman.com/collections/37afd82600127fbeef28',
        more : 'pass `profile` scope while Authorize'
    })
}, error);

router.get('/profile', authServer.authenticate({ scope : 'profile' }), (req, res) => {
    res.json({
        profile : req.user
    })
}, error);

router.all('/cb', (req, res) => response.ResponseReply(res, 200, { 'auth_code' : req.query.code }), error);

module.exports = router;