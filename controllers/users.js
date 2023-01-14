const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = process.env;
const NotFoundError = require("../errors/not-found-err");
const ExistingError = require("../errors/existing-err");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .orFail()
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("No user with matching ID found"));
      }

      res.send(user);
    })

    .catch(next);
};

module.exports.patchCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      name,
      avatar,
    },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("No user with matching ID found"));
      }

      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      return next(
        new ExistingError(
          "There is already a user existing with this email address"
        )
      );
    }
    return bcrypt.hash(password, 10).then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
        .then((newUser) =>
          res.send({
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
          })
        )
        .catch(next)
    );
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("Incorrect email or password"));
      }
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch(next);
};
