const express = require('express');
const router = express.Router();

const {
  getGuests,
  updateGuest,
  createGuest,
  deleteGuest,
  getGuestById,
} = require('../controllers/guestsController');

router.get('/users', getGuests);
router.patch('/users/:id', updateGuest);
router.post('/users', createGuest);
router.delete('/users/:id', deleteGuest);
router.get('/guests/:id', getGuestById);

module.exports = router;
