const ClothingItem = require('../models/clothingItem');

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ clothingItems: items }))
    .catch((err) => res.status(500).send({ message: `${err.message}` }));
};

module.exports.createClothingItem = (req, res) => {
  const {
    name, weather, imageUrl
  } = req.body;
  ClothingItem.create({
    name, weather, imageUrl, owner: req.user
  })
    .then((item) => res.send({ clothingItem: item }))
    .catch((err) => res.status(500).send({ message: `${err.message}` }));
};

module.exports.deleteClothingItem = (req, res) => {
  const { id } = req.body;
  ClothingItem.findByIdAndDelete({ id })
    .then(item => console.log(item))
    .catch((err) => res.status(500).send({ message: `${err.message}` }));
};
