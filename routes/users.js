const users = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/users');

users.get('/', getUsers);

users.get('/:id', getUser);

users.post('/', createUser);

module.exports = users;
