const express = require('express');
const cors = require('cors');
const AppError = require('./utils/appError');

const roomRoutes = require('./routes/roomroute');
const guestRoutes = require('./routes/guestsroute');
const bookingRoutes = require('./routes/bookingroute');
const adminRoutes = require('./routes/adminroute');

require('./models');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      console.log('Origin:', origin);

      // Allow requests without Origin (Postman, mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel preview deployments for this project
      if (
        /^https:\/\/rest-in-hotel-[a-z0-9-]+-sri-rayudus-projects\.vercel\.app$/.test(
          origin,
        )
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  }),
);

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/rooms', roomRoutes);
app.use('/guests', guestRoutes);
app.use('/bookings', bookingRoutes);

// 404 Handler
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);

  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
