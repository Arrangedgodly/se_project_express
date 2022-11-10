const ClothingItem = require('../models/clothingItem');
const { ERROR_CODES } = require('../utils/errors');

const returnDefaultError = (res) => res.status(ERROR_CODES.DefaultError).send({ message: 'An error has occurred on the server.' });

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ items }))
    .catch((err) => returnDefaultError(res));
};

module.exports.createClothingItem = (req, res) => {
  const {
    name, weather, imageUrl,
  } = req.body;
  ClothingItem.create({
    name, weather, imageUrl, owner: req.user,
  })
    .then((item) => res.status(200).send({ clothingItem: item }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODES.BadRequest).send({ message: 'There was an error finding the requested clothing item' });
      return returnDefaultError(res);
    });
};

module.exports.deleteClothingItem = (req, res) => {
  const { id } = req.body;
  ClothingItem.findByIdAndDelete({ id })
    .then((item) => res.status(200).send({ clothingItem: item }))
    .catch((err) => returnDefaultError(res));
};

module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((data) => res.status(200).send({ data }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODES.NotFound).send({ message: 'User not found' });
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
    .then((data) => res.status(200).send({ data }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODES.NotFound).send({ message: 'User not found' });
      return returnDefaultError(res);
    });
};
