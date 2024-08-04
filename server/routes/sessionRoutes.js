const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/start', sessionController.startSession);
router.post('/end', sessionController.endSession);
router.post('/verify', sessionController.verifySession);

module.exports = router;
