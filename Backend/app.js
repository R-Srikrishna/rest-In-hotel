const express = require('express');
const path = require('path');
const cors = require('cors');
const AppError = require('./utils/appError');
const roomRoutes = require('./routes/roomroute');
const guestRoutes = require('./routes/guestsroute');
const bookingRoutes = require('./routes/bookingroute');
const authRoutes = require('./routes/authroute');

const app = express();

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  }),
);
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
    message: err.message,
  });
});

module.exports = app;
