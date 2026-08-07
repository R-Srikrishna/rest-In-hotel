const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt'); // Make sure to npm install bcrypt

const Guest = sequelize.define(
  'guest',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Built-in email validation
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // Custom function completely fixes the SyntaxError by avoiding args:[]
        isValidLength(value) {
          if (!value || value.length < 6 || value.length > 100) {
            throw new Error(
              'Password must be between 6 and 100 characters long.',
            );
          }
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
      defaultValue: 'prefer_not_to_say',
      field: 'Gender',
    },
    country: {
      type: DataTypes.STRING,
    },
    nationality: {
      type: DataTypes.STRING,
    },
    // Track if account email verification is approved
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Secure unique tracking hash property for SendGrid URLs
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      // These hooks hash the password only after validation succeeds
      beforeCreate: async (guest) => {
        if (guest.password) {
          guest.password = await bcrypt.hash(guest.password, 10);
        }
      },
      beforeUpdate: async (guest) => {
        // Checks if the password field is being modified during an update
        if (guest.changed('password')) {
          guest.password = await bcrypt.hash(guest.password, 10);
        }
      },
    },
  },
);

module.exports = Guest;
