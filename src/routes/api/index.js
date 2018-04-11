/**
 * Created by StarkX on 08-Mar-18.
 */
const express = require('express');
const router = express.Router();
const response = require('../../response');

router.get('/', (req, res) => response.ResponseReply(res, 200, { title : xConfig.appName }));

module.exports = router;