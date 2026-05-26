const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
    checkInDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    checkOutDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    guestId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(
            'booked',
            'checked-in',
            'checked-out',
            'cancelled'
        ),
        defaultValue: 'booked'
    }
});

module.exports = Booking;