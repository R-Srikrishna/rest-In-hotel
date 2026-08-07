const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define(
  'booking',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // models/bookingModel.js
    guestName: {
      type: DataTypes.STRING,
      allowNull: true, // 👈 Allow NULL values
      // OR: defaultValue: 'Guest', // 👈 Provide a default fallback value
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id',
      },
    },
    guestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'guests',
        key: 'id',
      },
    },
    nightlyRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    selectedFeatures: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('booked', 'checked-in', 'checked-out', 'cancelled'),
      defaultValue: 'booked',
    },
  },
  {
    tableName: 'bookings',
    timestamps: true,
    paranoid: false,
  },
);

module.exports = Booking;
