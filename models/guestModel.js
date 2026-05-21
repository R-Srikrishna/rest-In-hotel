const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const Guest = sequelize.define('Guest',{
    name:{
        type:DataTypes.STRING,
        alllowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    role:{
        type:DataTypes.ENUM('admin','guest'),
        defaultValue:'guest'
    }
})

module.exports = Guest;