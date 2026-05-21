const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define('Room', {
    roomNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    roomType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    paranoid: true
});

module.exports = Room;