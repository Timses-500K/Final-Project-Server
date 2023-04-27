"use strict";
const { Model } = require("sequelize");
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
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      birth: DataTypes.DATE,
      visibility: DataTypes.STRING,
    },
    {
      hooks: {
        //bcrypt
        beforeCreate: function(user, options){
        }
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
