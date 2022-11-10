const router = require('express').Router();
const {
  getClothingItems, createClothingItem, deleteClothingItem, likeItem, dislikeItem,
} = require('../controllers/clothingItems');

router.get('/', getClothingItems);

router.post('/', createClothingItem);

router.delete('/:itemId', deleteClothingItem);

router.put('/:itemId/likes', likeItem);

router.delete('/:itemId/likes', dislikeItem);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

module.exports = router;
