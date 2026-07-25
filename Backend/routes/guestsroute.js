const express = require('express');
const guestsController = require('../controllers/guestsController');
const adminController = require('../controllers/adminController');

const router = express.Router();

// =============================================================================
// 🟢 PUBLIC GUEST ROUTES
// =============================================================================
router.post('/signup', guestsController.guestSignup);
router.post('/login', guestsController.guestLogin);

// =============================================================================
// 🟢 PROTECTED GUEST ROUTES (Logged-in Guests)
// =============================================================================
router.use('/me', guestsController.protectGuest);

// Profile Management for current guest
router.get('/me', guestsController.getMe);
router.patch('/me/update', guestsController.updateMe);

// =============================================================================
// 🔴 ADMIN & SUPER-ADMIN ROUTES
// =============================================================================
// Restrict all guest management routes below to logged-in Admins & Super-Admins
router.use(adminController.protectAdmin);
router.use(adminController.restrictTo('admin', 'super-admin'));

// Fetch all guests or manually create a new guest
router
  .route('/')
  .get(guestsController.getAllGuests)
  .post(guestsController.createGuest);

// Fetch, update, or delete a specific guest by ID
router
  .route('/:id')
  .get(guestsController.getGuestById)
  .patch(guestsController.updateGuest)
  .delete(guestsController.deleteGuest);

module.exports = router;
