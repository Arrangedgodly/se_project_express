const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const userRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingItems');
const { createUser, login } = require('./controllers/users');

const app = express();

const { PORT = 3000, DATABASE = 'mongodb://localhost:27017/wtwr_db' } = process.env;

mongoose.connect(DATABASE);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message
    });
});

app.listen(PORT, () => {
  console.log(`App live and listening at port ${PORT}`);
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', userRouter);

app.use('/items', clothingItemsRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});
