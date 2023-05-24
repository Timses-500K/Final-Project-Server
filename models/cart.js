"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    
    static associate(models) {
      Cart.belongsTo(models.User,{foreignKey: "userId"});
      Cart.belongsTo(models.Address,{foreignKey: "addressId"});
      Cart.belongsToMany(models.Item,{foreignKey: "cartId", through: models.CartItem,as: "cartItem"});
      Cart.hasMany(models.Order,{foreignKey: "cartId"});
      Cart.hasMany(models.CartItem,{foreignKey:"cartId"});
      Cart.belongsToMany(models.Size,{foreignKey: "sizeId", through: models.CartItem,as: "cartSize"});
    }
  }
  Cart.init(
    {
      userId: DataTypes.INTEGER,
      addressId: DataTypes.INTEGER,
      totalPrice: DataTypes.FLOAT,
      visibility: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      // If you want to give a custom name to the deletedAt column
      deletedAt: 'destroyTime',
      modelName: "Cart",
    }
  );
  return Cart;
};
