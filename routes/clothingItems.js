const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { celebrate, Joi } = require("celebrate");
const validateURL = require('../middlewares/validators');

router.get("/", getClothingItems);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      weather: Joi.string().valid("hot", "warm", "cold", "sunny").required(),
      imageUrl: Joi.string().required().custom(validateURL),
      id: Joi.number()
    }),
  }),
  auth,
  createClothingItem
);

router.delete("/:itemId", auth, deleteClothingItem);

router.put("/:itemId/likes", auth, likeItem);

router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
