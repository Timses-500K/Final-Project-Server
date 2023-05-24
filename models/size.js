"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {

    static associate(models) {
      Size.belongsToMany(models.Item,{foreignKey: "sizeId", through: models.ItemSize, as: "sizeItem"});
      Size.hasMany(models.ItemSize,{foreignKey:"sizeId"});
      Size.hasMany(models.CartItem,{foreignKey: "sizeId"});
      Size.belongsToMany(models.Cart,{foreignKey: "sizeId", through: models.CartItem, as: "sizeCart"});
      // Size.belongsToMany(models.Item,{foreignKey: "sizeId", through: models.CartItem, as: "sizeCart"});
    }
  }
  Size.init(
    {
      size: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Size",
    }
  );
  return Size;
};
