const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/auth-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Elise Bouer',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://practicum.com/attempt/web/14379442/lesson/be4be824-cb97-45fe-bfd5-3df68652e452/task/7f20032e-e6b0-421e-b29a-a6485f562ab5/index/18/',
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'You must enter a valid URL',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: 'You must enter a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .orFail()
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Incorrect Email or Password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Incorrect Email or Password'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
