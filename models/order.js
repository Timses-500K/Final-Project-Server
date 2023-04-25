'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {

    static associate(models) {
      Order.belongsTo(models.User,{foreignKey: "userId"});
      Order.belongsToMany(models.Item,{foreignKey: "orderId", through: models.OrderItem,as:"orderItem"})
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    subtotal: DataTypes.FLOAT,
    totalPrice: DataTypes.FLOAT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};