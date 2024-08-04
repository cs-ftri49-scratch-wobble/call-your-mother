const Session = require('../models/Session');

const sessionController = {};

sessionController.verifySession = (req, res, next) => {
  console.log('Received request to verify session'); // Log request received

  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    console.log('Session ID not found in cookies'); // Log missing session ID
    return res.status(401).json({ message: 'Session not found' });
  }

  Session.findById(sessionId)
    .then(session => {
      if (!session) {
        console.log('Session not found in database'); // Log session not found
        return res.status(401).json({ message: 'Session not found' });
      }

      req.session = session;
      console.log('Session is valid:', session); // Log valid session
      return res.status(200).json({ message: 'Session is valid', session: req.session });
    })
    .catch(err => {
      console.error('Error verifying session:', err); // Log error
      next({
        log: 'sessionController.verifySession: Error verifying session',
        status: 500,
        message: { err: 'Error occurred during session verification' }
      });
    });
}

module.exports = sessionController;
