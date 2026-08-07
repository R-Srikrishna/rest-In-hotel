// models/index.js
const Admin = require('./adminModel');
const Booking = require('./bookingModel');
const Guest = require('./guestModel');
const Room = require('./roomModel');

// Defines association where a guest can have multiple bookings
Guest.hasMany(Booking, { foreignKey: 'guestId', onDelete: 'CASCADE' });
Booking.belongsTo(Guest, { foreignKey: 'guestId' });

// Defines association where a room can have multiple bookings
Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

module.exports = {
  Admin,
  Booking,
  Guest,
  Room,
};
