/**
 * Created by StarkX on 08-Mar-18.
 */
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index.ejs', { title : xConfig.appName });
});

module.exports = router;