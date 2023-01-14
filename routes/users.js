const router = require("express").Router();
const { getCurrentUser, patchCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { celebrate, Joi } = require("celebrate");
const validateURL = require("../middlewares/validators");

router.get("/me", auth, getCurrentUser);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().custom(validateURL),
    }),
  }),
  auth,
  patchCurrentUser
);

module.exports = router;
