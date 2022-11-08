const ClothingItem = require('../models/clothingItem');

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ clothingItems: items }))
    .catch(() => res.status(500).send({ message: 'Error' }));
};

module.exports.createClothingItem = (req, res) => {
  const {
    name, weather, imageUrl, ownerId,
  } = req.body;
  ClothingItem.create({
    name, weather, imageUrl, owner: ownerId,
  })
    .then((item) => res.send({ clothingItem: item }))
    .catch(() => res.status(500).send({ message: 'Error' }));
};

module.exports.deleteClothingItem = (req, res) => {

};
