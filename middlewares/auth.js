const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const AuthorizationError = require("../errors/auth-err");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AuthorizationError("You are not authorized"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthorizationError("You are not authorized"));
  }

  req.user = payload;

  return next();
};
