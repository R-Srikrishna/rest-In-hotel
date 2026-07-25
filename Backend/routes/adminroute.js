const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// =============================================================================
// 🔓 PUBLIC ROUTES
// =============================================================================
router.post('/login', adminController.adminLogin);

// =============================================================================
// 🔒 PROTECTED ROUTES (Requires valid JWT Token)
// =============================================================================
router.use(adminController.protectAdmin);

// -----------------------------------------------------------------------------
// 👑 SUPER-ADMIN ONLY ROUTES
// -----------------------------------------------------------------------------
router
  .route('/manage-admins')
  .get(adminController.restrictTo('super-admin'), adminController.getAllAdmins)
  .post(adminController.restrictTo('super-admin'), adminController.createAdmin);

router
  .route('/manage-admins/:id')
  .patch(adminController.restrictTo('super-admin'), adminController.updateAdmin)
  .delete(
    adminController.restrictTo('super-admin'),
    adminController.deleteAdmin,
  );

// -----------------------------------------------------------------------------
// 📊 DASHBOARD ROUTES (ACCESSIBLE BY BOTH ADMIN & SUPER-ADMIN)
// -----------------------------------------------------------------------------
// Guest Management
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

// Booking Management
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

// Room Management
router
  .route('/rooms')
  .get(
    adminController.restrictTo('admin', 'super-admin'),
    adminController.getRooms,
  );

module.exports = router;
