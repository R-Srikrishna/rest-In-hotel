const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define(
  'Admin',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true, // Optional so email-only creations won't fail
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('super-admin', 'admin'),
      allowNull: false,
      defaultValue: 'admin',
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      },
    },
  },
);

module.exports = Admin;
