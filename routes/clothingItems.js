const clothingItems = require('express').Router();
const { getClothingItems, createClothingItem, deleteClothingItem } = require('../controllers/clothingItems');

clothingItems.get('/', getClothingItems);

clothingItems.post('/', createClothingItem);

clothingItems.deleteClothingItem('/:id', deleteClothingItem);

module.exports = clothingItems;
