const ClothingItem = require("../models/clothingItem");
const PermissionsError = require("../errors/permissions-err");
const NotFoundError = require("../errors/not-found-err");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      if (!items) {
        next(new NotFoundError("There were no items found"));
      }
      res.send(items);
    })
    .catch(next);
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user,
  })
    .then((item) => res.status(201).send(item))
    .catch(next);
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.equals(req.user._id)) {
        return item.remove(() => res.send({ clothingItem: item }));
      }
      next(
        new PermissionsError("You do not have permission to delete this item")
      );
    })
    .catch(next);
};

module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((data) => res.send(data))
    .catch(next);
};

module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((data) => res.send(data))
    .catch(next);
};
