const express = require('express');
const sessionController = require('../controllers/sessionController');
const router = express.Router();

router.get('/verify', sessionController.verifySession);

module.exports = router;