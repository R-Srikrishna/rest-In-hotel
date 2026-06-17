const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByType,
  getRoomsByPriceRange,
  getRoomsByTypeAndPriceRange,
  getRoomsByAvailability,
  getRoomsByTypeAndAvailability,
  bookRoom,
  getAvailableRooms,
  releaseRoomAfterCheckout,
} = require('../controllers/roomsController');
// ROOM VIEWING ENDPOINTS - Visible to Guests & Admin
// Get all rooms (Guests & Admin)
router.get(
  '/',
  authController.protect,
  authController.restrictToAdmin,
  getRooms,
);

// Get available rooms for date range (Guests & Admin)
router.get('/available/search', authController.protect, getAvailableRooms);

// Get rooms by type and availability (Guests & Admin)
router.get(
  '/filter/type-availability',
  authController.protect,
  getRoomsByTypeAndAvailability,
);

// Get rooms by availability (Guests & Admin)
router.get(
  '/filter/availability',
  authController.protect,
  getRoomsByAvailability,
);

// Get rooms by type and price range (Guests & Admin)
router.get(
  '/filter/type-price',
  authController.protect,
  getRoomsByTypeAndPriceRange,
);

// Get rooms by price range (Guests & Admin)
router.get('/filter/price', authController.protect, getRoomsByPriceRange);

// Get rooms by type (Guests & Admin)
router.get('/filter/type', authController.protect, getRoomsByType);

// Get single room by ID (Guests & Admin)
router.get('/:id', authController.protect, getRoomById);
// ROOM MANAGEMENT ENDPOINTS - Admin Only
// Book a room (Guests & Admin can book - simple flow)
router.post('/bookings', authController.protect, bookRoom);

// Create new room (Admin only)
router.post(
  '/',
  authController.protect,
  authController.restrictToAdmin,
  createRoom,
);

// Update room (Admin only)
router.patch(
  '/:id',
  authController.protect,
  authController.restrictToAdmin,
  updateRoom,
);

// Release/Clear room availability after checkout (Admin only)
router.patch(
  '/:id/release',
  authController.protect,
  authController.restrictToAdmin,
  releaseRoomAfterCheckout,
);

// Delete room (Admin only)
router.delete(
  '/:id',
  authController.protect,
  authController.restrictToAdmin,
  deleteRoom,
);

module.exports = router;
