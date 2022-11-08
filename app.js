const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingItems');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.listen(PORT, () => {
  console.log(`App live and listening at port ${PORT}`);
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '6369e136a39ce1c576f1b1c2'
  };
  next();
});

app.use('/clothing-items', clothingItemsRouter);
