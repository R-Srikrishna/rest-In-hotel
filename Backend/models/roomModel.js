const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define(
  'Room',
  {
    roomNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    roomType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tv: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    fridge: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    washingMachine: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    heater: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    bathtub: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    internetAccess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    coffeeTea: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    privatePool: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    paranoid: true
  }
);

module.exports = Room;