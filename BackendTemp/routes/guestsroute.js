const express = require('express');
const guestsController = require('../controllers/guestsController');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Public routes for guest signup and login
router.post('/signup', guestsController.guestSignup);
router.post('/login', guestsController.guestLogin);

// Protects all personal profile routes with guest authentication middleware
router.use('/me', guestsController.protectGuest);

// Profile management routes for the currently authenticated guest
router.get('/me', guestsController.getMe);
router.patch('/me/update', guestsController.updateMe);

// Protects all subsequent routes for administrative access only
router.use(adminController.protectAdmin);
router.use(adminController.restrictTo('admin', 'super-admin'));

// Admin routes for retrieving all guest profiles or creating a guest record
router
  .route('/')
  .get(guestsController.getAllGuests)
  .post(guestsController.createGuest);

// Admin routes for fetching, updating, or deleting a specific guest by ID
router
  .route('/:id')
  .get(guestsController.getGuestById)
  .patch(guestsController.updateGuest)
  .delete(guestsController.deleteGuest);

module.exports = router;
