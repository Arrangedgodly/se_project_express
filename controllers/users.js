const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(500).send({ message: 'Error' }));
};

module.exports.getUser = (req, res) => {
  const { name } = req.body;
  User.find({ name })
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: 'Error' }));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: 'Error' }));
};
