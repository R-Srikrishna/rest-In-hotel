const express = require('express');
const router = express.Router();

const {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
} = require('../controllers/guestsController');

const authController = require('../controllers/authController');

// Admin Only Routes
router.get('/users', authController.protect, getGuests);
router.get('/users/:id', authController.protect, getGuestById);
router.post(
  '/users',
  authController.protect,
  authController.restrictToAdmin,
  createGuest,
);
router.patch(
  '/users/:id',
  authController.protect,
  authController.restrictToAdmin,
  updateGuest,
);
router.delete(
  '/users/:id',
  authController.protect,
  authController.restrictToAdmin,
  deleteGuest,
);

// Non-admin Routes
router.get('/me', authController.protect, getGuestById); // accessible to all logged-in users

module.exports = router;
