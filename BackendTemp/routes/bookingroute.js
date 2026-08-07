const express = require('express');
const bookingsController = require('../controllers/bookingsController');
const guestsController = require('../controllers/guestsController');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Public route to check available rooms for specified dates
router.get('/available-rooms', bookingsController.getAvailableRooms);

// Authenticated guest route to create a new booking
router.post(
  '/my-booking',
  guestsController.protectGuest,
  bookingsController.createBooking,
);

// Authenticated guest route to retrieve all personal bookings
router.get(
  '/my-bookings',
  guestsController.protectGuest,
  bookingsController.getMyBookings,
);

// Authenticated guest route to retrieve a specific personal booking by ID
router.get(
  '/my-bookings/:id',
  guestsController.protectGuest,
  bookingsController.getMyBookingById,
);

// Protects subsequent routes for administrative access only
router.use(adminController.protectAdmin);
router.use(adminController.restrictTo('admin', 'super-admin'));

// Admin routes for fetching all bookings or creating a booking as an admin
router
  .route('/')
  .get(bookingsController.getAllBookings)
  .post(bookingsController.createAdminBooking);

// Admin routes for getting, updating, or deleting a specific booking by ID
router
  .route('/:id')
  .get(bookingsController.getBookingById)
  .patch(bookingsController.updateBooking)
  .delete(bookingsController.deleteBooking);

module.exports = router;
