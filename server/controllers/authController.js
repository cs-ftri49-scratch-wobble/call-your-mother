const User = require('../models/User'); // placeholder label and file location
const Session = require('../models/Session');

const authController = {};

authController.signup = (req, res, next) => {
  const { name, username, password } = req.body;

  // Check if the user already exists
  User.findOne({ username })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      } else {
        const newUser = new User({ name, username, password });
        return newUser.save();
      }
    })
    .then(() => {
      res.status(200).json({ message: 'User signup successful' });
    })
    .catch(() =>
      next({
        log: 'authController.register: Error creating new user',
        status: 500,
        message: { err: 'Error occurred during user registration' },
      })
    );
};

authController.login = (req, res, next) => {
  const { name, username, password } = req.body;

  User.findOne({ username, password })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ message: 'Invalid username or password' });
      }

      // Create a new session for the user
      const newSession = new Session({ userId: user._id });
      return newSession
        .save()
        .then((session) =>
          res
            .status(200)
            .json({ message: 'Login successful', sessionId: session._id })
        );
    })
    .catch(() =>
      next({
        log: 'authController.login: Error finding user',
        status: 500,
        message: { err: 'Error occurred during user login' },
      })
    );
};

module.exports = authController;
