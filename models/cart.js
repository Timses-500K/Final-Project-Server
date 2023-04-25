"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    
    static associate(models) {
      Cart.belongsTo(models.User,{foreignKey: "userId"});
      Cart.belongsTo(models.Address,{foreignKey: "addressId"});
      Cart.belongsToMany(models.Item,{foreignKey: "cartId", through: models.CartItem,as: "cartItem"});
    }
  }
  Cart.init(
    {
      userId: DataTypes.INTEGER,
      addressId: DataTypes.INTEGER,
      totalPrice: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
