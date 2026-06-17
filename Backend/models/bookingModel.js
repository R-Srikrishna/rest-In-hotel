const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('bookings', {
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
        allowNull: false,
        references: {
            model: 'Rooms',
            key: 'id'
        }
    },
    guestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Guests',
            key: 'id'
        }
    },
    nightlyRate: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    selectedFeatures: {
        type: DataTypes.JSON,
        allowNull: true
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
}, {
    timestamps: true,
    paranoid: false
});

module.exports = Booking;