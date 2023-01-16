const jwt = require('jsonwebtoken');

const { JWT_SECRET = '0c4ae04e510419153d1cd2e66c2f85e6cd30282b85e568053db8c6aef75087e3' } = process.env;
const AuthorizationError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('You are not authorized'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthorizationError('You are not authorized'));
  }

  req.user = payload;

  return next();
};
