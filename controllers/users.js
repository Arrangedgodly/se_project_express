const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: `${err.message}` }));
};

module.exports.getUser = (req, res) => {
  const { name } = req.body;
  User.find({ name })
    .orFail(() => {
      const error = new Error('user not found');
      err.statusCode = 404;
      throw error;
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: `${err.message}` }));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `${err.message}` }));
};
