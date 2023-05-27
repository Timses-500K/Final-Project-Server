"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: "userId" });
      Order.belongsToMany(models.Item, { foreignKey: "orderId", through: models.OrderItem, as: "orderItem" });
      Order.belongsTo(models.Cart, { foreignKey: "cartId" });
      Order.hasMany(models.OrderItem, { foreignKey: "orderId" });
      Order.belongsTo(models.Address, { foreignKey: "addressId" });
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      cartId: DataTypes.INTEGER,
      subtotal: DataTypes.FLOAT,
      totalPrice: DataTypes.FLOAT,
      status: DataTypes.STRING,
      payment: DataTypes.STRING,
      addressId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
