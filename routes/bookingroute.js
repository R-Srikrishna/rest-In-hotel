const express = require('express');
const router = express.Router();

const {getBookings} = require('../controllers/bookingsController')

router.get('/bookings',getBookings)

module.exports = router;