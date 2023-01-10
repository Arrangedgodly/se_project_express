const ERROR_CODES = {
  BadRequest: 400,
  AuthorizationError: 401,
  PermissionsError: 403,
  NotFound: 404,
  ExistingError: 409,
  DefaultError: 500,
};

module.exports = { ERROR_CODES };