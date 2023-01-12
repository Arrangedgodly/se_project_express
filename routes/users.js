const router = require('express').Router();
const { getCurrentUser, patchCurrentUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');

router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, patchCurrentUser);

module.exports = router;
