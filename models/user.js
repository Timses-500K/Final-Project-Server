"use strict";
const { Model } = require("sequelize");
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    static associate(models) {
      User.hasMany(models.Address,{foreignKey: "userId"});
      User.hasMany(models.Order,{foreignKey: "userId"});
      User.hasOne(models.Cart,{foreignKey: "userId"});
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          notEmpty: true,
        },
      },
      email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          notEmpty: true,
        },
      }, 
      password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
        notEmpty: true,
        },
      }, 
      firstName:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
        notEmpty: true,
        },
      }, 
      lastName: DataTypes.STRING,
      birth: DataTypes.DATE,
      visibility: {
        type: DataTypes.STRING,
        defaultValue: 'True'
      }
    },
    {
      hooks: {
        beforeCreate: async function (user) {
          // Use bcrypt to hash the user's password before saving it
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          user.password = hashedPassword;
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
          }
        }
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
