const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Public route for admin authentication
router.post('/login', adminController.adminLogin);

// Protects all subsequent routes with JWT authentication middleware
router.use(adminController.protectAdmin);

// Super-admin routes for listing and creating admin accounts
router
  .route('/manage-admins')
  .get(adminController.restrictTo('super-admin'), adminController.getAllAdmins)
  .post(adminController.restrictTo('super-admin'), adminController.createAdmin);

// Super-admin routes for updating and deleting specific admin accounts
router
  .route('/manage-admins/:id')
  .patch(adminController.restrictTo('super-admin'), adminController.updateAdmin)
  .delete(
    adminController.restrictTo('super-admin'),
    adminController.deleteAdmin,
  );

// Guest management routes for retrieving and creating guest accounts
router
  .route('/guests')
  .get(
    adminController.restrictTo('admin', 'super-admin'),
    adminController.getGuests,
  )
  .post(
    adminController.restrictTo('admin', 'super-admin'),
    adminController.createGuests,
  );

// Guest management routes for updating and deleting individual guest records
router
  .route('/guests/:id')
  .patch(
    adminController.restrictTo('admin', 'super-admin'),
    adminController.updateGuest,
  )
  .delete(
    adminController.restrictTo('admin', 'super-admin'),
    adminController.deleteGuest,
  );

// Booking management routes for listing and creating bookings
router
  .route('/bookings')
  .get(
    adminController.restrictTo('admin', 'super-admin'),
    adminController.getBookings,
  )
  .post(
    adminController.restrictTo('admin', 'super-admin'),
    adminController.createBooking,
  );

// Room management route for retrieving rooms
router
  .route('/rooms')
  .get(
    adminController.restrictTo('admin', 'super-admin'),
    adminController.getRooms,
  );

module.exports = router;
