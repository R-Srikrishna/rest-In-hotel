// models/Room.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define(
  'room',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    roomNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'room_number', // Adjust if your DB column is named roomNumber
    },
    roomType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'room_type', // Fixes 'Room.type' error!
    },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    tv: { type: DataTypes.BOOLEAN, defaultValue: false },
    fridge: { type: DataTypes.BOOLEAN, defaultValue: false },
    washingMachine: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'washing_machine',
    },
    heater: { type: DataTypes.BOOLEAN, defaultValue: false },
    bathtub: { type: DataTypes.BOOLEAN, defaultValue: false },
    internetAccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'internet_access',
    },
    coffeeTea: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'coffee_tea',
    },
    privatePool: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'private_pool',
    },
    airConditioning: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'air_conditioning',
    },
    fan: { type: DataTypes.BOOLEAN, defaultValue: false },
    sofa: { type: DataTypes.BOOLEAN, defaultValue: false },
    chairs: { type: DataTypes.BOOLEAN, defaultValue: false },
    bed: { type: DataTypes.BOOLEAN, defaultValue: true },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'rooms',
    timestamps: false,
  },
);

module.exports = Room;
