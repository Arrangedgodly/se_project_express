const ClothingItem = require('../models/clothingItem');
const { ERROR_CODES } = require('../utils/errors');

const returnDefaultError = (res) => res.status(ERROR_CODES.DefaultError).send({ message: 'An error has occurred on the server.' });

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => returnDefaultError(res));
};

module.exports.createClothingItem = (req, res) => {
  const {
    name, weather, imageUrl,
  } = req.body;
  ClothingItem.create({
    name, weather, imageUrl, owner: req.user,
  })
    .then((item) => res.status(201).send({ clothingItem: item }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODES.BadRequest).send({ message: 'There was an error finding the requested clothing item' });
      return returnDefaultError(res);
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.equals(req.user._id)) {
        return item.remove(() => res.send({ clothingItem: item }));
      }
      return res.status(ERROR_CODES.PermissionsError).send({ message: 'Insuffient permissions to delete item' });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') return res.status(ERROR_CODES.BadRequest).send({ message: 'There was an error with the delete request' });
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODES.NotFound).send({ message: 'Item not found' });
      return returnDefaultError(res);
    });
};

module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODES.NotFound).send({ message: 'Item not found' });
      if (err.name === 'CastError') return res.status(ERROR_CODES.BadRequest).send({ message: 'There was an error with the like request' });
      return returnDefaultError(res);
    });
};

module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((data) => res.send({ data }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODES.NotFound).send({ message: 'Item not found' });
      if (err.name === 'CastError') return res.status(ERROR_CODES.BadRequest).send({ message: 'There was an error with the unlike request' });
      return returnDefaultError(res);
    });
};
