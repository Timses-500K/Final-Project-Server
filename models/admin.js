'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {

  class Admin extends Model {
    static associate(models) {
    }
  }

  Admin.init({
    username:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Admin',
    hooks: {
      beforeCreate: async (admin) => {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        admin.password = hashedPassword;
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          const hashedPassword = await bcrypt.hash(admin.password, 10);
          admin.password = hashedPassword;
        }
      }
    }
  });

  return Admin;
};
