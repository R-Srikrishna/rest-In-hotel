const express = require('express');
const router = express.Router();

const {getGuests, updateGuests,createGuest,deleteGuest,getGuestById} = require('../controllers/guestsController');

router.get('/guests',getGuests)
router.post('/guests',createGuest)
router.patch('/guests/:id',updateGuests)
router.delete('/guests/:id',deleteGuest)
router.get('/guests/:id',getGuestById)

module.exports = router;