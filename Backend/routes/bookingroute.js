const express = require('express');
const bookingsController = require('../controllers/bookingsController');
const guestsController = require('../controllers/guestsController');
const adminController = require('../controllers/adminController');

const router = express.Router();

// =============================================================================
// 🟢 CLIENT (GUEST) SIDE ROUTES
// =============================================================================

// Public: Get available rooms for dates
router.get('/available-rooms', bookingsController.getAvailableRooms);

// Guest actions (Requires guest auth)
router.post(
  '/my-booking',
  guestsController.protectGuest,
  bookingsController.createBooking,
);
router.get(
  '/my-bookings',
  guestsController.protectGuest,
  bookingsController.getMyBookings,
);
router.get(
  '/my-bookings/:id',
  guestsController.protectGuest,
  bookingsController.getMyBookingById,
);

// =============================================================================
// 🔴 ADMIN DASHBOARD ROUTES
// =============================================================================
router.use(adminController.protectAdmin);
router.use(adminController.restrictTo('admin', 'super-admin'));

// Admin Dashboard: View total bookings or Add new booking
router
  .route('/')
  .get(bookingsController.getAllBookings)
  .post(bookingsController.createAdminBooking);

// Admin Dashboard: View single booking, Update booking, or Delete booking
router
  .route('/:id')
  .get(bookingsController.getBookingById)
  .patch(bookingsController.updateBooking)
  .delete(bookingsController.deleteBooking);

module.exports = router;
