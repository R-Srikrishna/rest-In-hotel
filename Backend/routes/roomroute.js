const express = require('express');
const roomsController = require('../controllers/roomsController');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Public route to view all rooms in the catalog
router.get('/', roomsController.getAllRooms);

// Public route to filter available rooms
if (roomsController.getAvailableRooms) {
  router.get('/available', roomsController.getAvailableRooms);
}

// Public route to view detailed specifications for a specific room by ID
router.get('/:id', roomsController.getRoomById);

// Protects all subsequent room management endpoints for administrative access only
router.use(adminController.protectAdmin);
router.use(adminController.restrictTo('admin', 'super-admin'));

// Admin route to create a new room
router.post('/', roomsController.createRoom);

// Admin route to toggle room availability or out-of-service status
router.patch('/:id/availability', roomsController.toggleRoomAvailability);

// Admin routes to update or delete a room by ID
router
  .route('/:id')
  .patch(roomsController.updateRoom)
  .delete(roomsController.deleteRoom);

module.exports = router;
