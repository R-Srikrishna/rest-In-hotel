const express = require('express');
const router = express.Router();

const {getBookings, createBooking, deleteBooking, updateBooking} = require('../controllers/bookingsController')

router.get('/getbookings',getBookings)
router.post('/addbooking',createBooking)
router.patch('/updatebooking/:id',updateBooking)
router.delete('/deletebooking/:id',deleteBooking)

module.exports = router;