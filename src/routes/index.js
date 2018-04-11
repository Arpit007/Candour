/**
 * Created by StarkX on 08-Mar-18.
 */
const express = require('express');
const router = express.Router();

router.use('/api', require('./api/index'));
router.use('/', require('./express'));
router.use('/', require('./test'));
router.use('/', require('./web/index'));

module.exports = router;