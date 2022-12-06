const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_CODES } = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

const returnDefaultError = (res) => res.status(ERROR_CODES.DefaultError).send({ message: 'An error has occurred on the server.' });

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => returnDefaultError(res));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById({ _id: req.user._id })
    .orFail()
    .then((user) => res.send(user))

    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODES.NotFound).send({ message: 'User not found' });
      if (err.name === 'CastError') return res.status(ERROR_CODES.BadRequest).send({ message: 'There was an error with the request' });
      return returnDefaultError(res);
    });
};

module.exports.patchCurrentUser = (req, res) => {
  const {
    name, avatar,
  } = req.body;
  User.findByIdAndUpdate({ _id: req.user._id }, {
    name, avatar,
  }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODES.NotFound).send({ message: 'User not found' });
      if (err.name === 'CastError' || err.name === 'ValidationError') return res.status(ERROR_CODES.BadRequest).send({ message: 'There was an error with the request' });
      return returnDefaultError(res);
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(ERROR_CODES.ExistingError).send({ message: 'There is already an existing user with this email' });
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, avatar, email, password: hash,
        })
          .then((newUser) => res.send({
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
          }))
          .catch((err) => {
            if (err.name === 'ValidationError') return res.status(ERROR_CODES.BadRequest).send({ message: 'There is an error validating your POST request' });
            return returnDefaultError(res);
          }));
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((err) => {
      res
        .status(ERROR_CODES.AuthorizationError)
        .send({ message: `There was an error with the login request. Error: ${err.message}` });
    });
};
