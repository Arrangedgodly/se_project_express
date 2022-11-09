const User = require('../models/user');
const { ERROR_CODES } = require('../utils/errors');

const returnDefaultError = (res) => res.status(ERROR_CODES.DefaultError).send({ message: 'An error has occurred on the server.' });

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => returnDefaultError(res));
};

module.exports.getUser = (req, res) => {
  const { _id } = req.body;
  User.findById({ _id })
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODES.NotFound).send({ message: 'User not found' });
      return returnDefaultError(res);
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODES.BadRequest).send({ message: 'There is an error validating your POST request' });
      return returnDefaultError(res);
    });
};
