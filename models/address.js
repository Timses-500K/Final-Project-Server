"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {

    static associate(models) {
      Address.belongsTo(models.User,{foreignKey:"userId"});
    }
  }
  Address.init(
    {
      userId: DataTypes.INTEGER,
      addressName: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      postalCode: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
