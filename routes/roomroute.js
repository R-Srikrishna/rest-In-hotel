const express = require('express');
const router = express.Router();

const {getRooms} = require('../controllers/roomsController');

router.get('/rooms',getRooms)

module.exports = router;
