const express = require('express');
const roomsController = require('../controllers/roomsController');
const adminController = require('../controllers/adminController');

const router = express.Router();

// =============================================================================
// 🟢 PUBLIC & GUEST ROUTES
// =============================================================================

// Public catalog: View available rooms for booking
router.get('/available', roomsController.getAvailableRooms);

// Public/Guest: View detailed specs for a specific room
router.get('/:id', roomsController.getRoomById);

// =============================================================================
// 🔴 ADMIN & SUPER-ADMIN ROUTES
// =============================================================================

// Protect all management endpoints below
router.use(adminController.protectAdmin);
router.use(adminController.restrictTo('admin', 'super-admin'));

// Admin: View all rooms (including maintenance/unavailable) OR add a new room
router
  .route('/')
  .get(roomsController.getRooms)
  .post(roomsController.createRoom);

// Admin: Update room pricing/status OR remove a room from inventory
router
  .route('/:id')
  .patch(roomsController.updateRoom)
  .delete(roomsController.deleteRoom);

module.exports = router;
