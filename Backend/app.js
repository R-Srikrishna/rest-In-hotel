const express = require('express');
const path = require('path');
const AppError = require('./utils/appError');
const roomRoutes = require('./routes/roomroute');
const guestRoutes = require('./routes/guestsroute');
const bookingRoutes = require('./routes/bookingroute');
const authRoutes = require('./routes/authroute');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/guests', guestRoutes);
app.use('/bookings', bookingRoutes);

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;