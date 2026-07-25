// models/index.js
const Admin = require('./adminModel');
const Booking = require('./bookingModel');
const Guest = require('./guestModel');
const Room = require('./roomModel');

// ==========================================
// Define Model Associations
// ==========================================

// 1. Guest <-> Booking (One-to-Many)
Guest.hasMany(Booking, { foreignKey: 'guestId', onDelete: 'CASCADE' });
Booking.belongsTo(Guest, { foreignKey: 'guestId' });

// 2. Room <-> Booking (One-to-Many)
Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

module.exports = {
  Admin,
  Booking,
  Guest,
  Room,
};
