const User = require('../models/UserModel');
const Session = require('../models/Session');

const authController = {};

authController.signup = (req, res, next) => {
  const { name, username, password } = req.body;

  console.log('Received signup request:', req.body);

  User.findOne({ username })
    .then(user => {
      if (user) {
        console.log('User already exists:', username);
        return res.status(400).json({ message: 'User already exists' });
      } else {
        const newUser = new User({ name, username, password });
        return newUser.save();
      }
    })
    .then(() => {
      console.log('User signup successful:', username);
      res.status(200).json({ message: 'User signup successful' });
    })
    .catch(err => {
      console.error('Error during user signup:', err);
      next({
        log: 'authController.signup: Error creating new user',
        status: 500,
        message: { err: 'Error occurred during user registration' }
      });
    });
}

authController.login = (req, res, next) => {
  const { username, password } = req.body;

  console.log('Received login request:', req.body);

  User.findOne({ username, password })
    .then(user => {
      console.log('User found:', user);

      if (!user) {
        console.log('Invalid username or password:', username);
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      const newSession = new Session({ userId: user._id });
      return newSession.save()
        .then(session => {
          console.log('Session created successfully:', session);
          res.cookie('sessionId', session._id, { httpOnly: true });
          console.log('Cookie set:', res.getHeader('Set-Cookie'));
          res.status(200).json({ message: 'Login successful' });
        })
        .catch(err => {
          console.error('Error creating session:', err);
          next({
            log: 'authController.login: Error creating session',
            status: 500,
            message: { err: 'Error occurred during session creation' }
          });
        });
    })
    .catch(err => {
      console.error('Error finding user during login:', err);
      next({
        log: 'authController.login: Error finding user',
        status: 500,
        message: { err: 'Error occurred during user login' }
      });
    });
}

module.exports = authController;
