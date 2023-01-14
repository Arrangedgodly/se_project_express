const ClothingItem = require("../models/clothingItem");
const PermissionsError = require("../errors/permissions-err");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");

module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      if (!items) {
        return next(new NotFoundError("There were no items found"));
      } else {
        return res.send(items);
      }
    })
    .catch(next);
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user,
  })
    .then((item) => {
      if (!item) {
        return next(new BadRequestError('There was a problem with the data submitted'))
      }
      return res.status(201).send(item);
    })
    .catch(next);
};

module.exports.deleteClothingItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.equals(req.user._id)) {
        return item.remove(() => {
          res.send(item);
        });
      } else {
        return next(
          new PermissionsError("You do not have permission to delete this item")
        );
      }
    })
    .catch(next);
};

module.exports.likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((data) => {
      return res.send(data);
    })
    .catch(next);
};

module.exports.dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((data) => {
      return res.send(data);
    })
    .catch(next);
};
