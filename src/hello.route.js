const express = require('express');
const helloController = require('./hello.controller');

const router = express.Router();

router.get('/:say', helloController.getHello);

router.use('/hello', router);

module.exports = router;
