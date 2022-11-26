const router = require('express').Router();
const { getCurrentUser, createUser, patchCurrentUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/', createUser);
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, patchCurrentUser);
router.get('/signin', login);

module.exports = router;
