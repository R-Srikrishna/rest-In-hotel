const express = require('express');
const router = express.Router();

const {getGuests} = require('../controllers/guestsController');

router.get('/guests',getGuests)

module.exports = router;