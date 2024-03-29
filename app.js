require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const userRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingItems');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const validateURL = require('./middlewares/validators');
const NotFoundError = require('./errors/not-found-err');

const allowedOrigins = [
  'https://graydonwasil.students.nomoredomainssbs.ru',
  'http://graydonwasil.students.nomoredomainssbs.ru',
  'http://localhost:3000',
];

const app = express();

const { PORT = '3001', DATABASE = 'mongodb://localhost:27017/wtwr_db' } = process.env;

mongoose.connect(DATABASE);

app.listen(PORT, () => {
  console.log(`App live and listening at port ${PORT}`);
});

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().custom(validateURL),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use('/users', userRouter);

app.use('/items', clothingItemsRouter);

app.use('*', () => {
  throw new NotFoundError('There was no API command found at this URL');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.error(err);
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});
