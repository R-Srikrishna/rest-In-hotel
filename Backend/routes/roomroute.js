const express = require('express');
const router = express.Router();

const {getRooms, createRoom, deleteRoom, getRoomById, updateRoom} = require('../controllers/roomsController');

router.get('/rooms',getRooms)
router.post('/rooms',createRoom)
router.patch('/rooms/:id',updateRoom)
router.get('/rooms/:id',getRoomById)
router.delete('/rooms/:id',deleteRoom)



module.exports = router;
