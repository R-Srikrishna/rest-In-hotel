const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingsController');

// BOOKING ENDPOINTS - Admin Only

// Get all bookings (Admin only)
router.get(
  '/rooms',
  authController.protect,
  authController.restrictToAdmin,
  getBookings,
);

// Get booking by ID (Admin only)
router.get(
  '/rooms/:id',
  authController.protect,
  authController.restrictToAdmin,
  getBookingById,
);

// Update booking (Admin only)
router.patch(
  '/rooms/:id',
  authController.protect,
  authController.restrictToAdmin,
  updateBooking,
);

// Delete booking (Admin only)
router.delete(
  '/rooms/:id',
  authController.protect,
  authController.restrictToAdmin,
  deleteBooking,
);

module.exports = router;
