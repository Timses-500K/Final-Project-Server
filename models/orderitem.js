'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {

    static associate(models) {
      OrderItem.belongsTo(models.Item,{foreignKey: "itemId"});
      OrderItem.belongsTo(models.Order,{foreignKey: "orderId"});
      OrderItem.belongsTo(models.Size,{foreignKey: "sizeId"});
    }
  }
  OrderItem.init({
    orderId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    sizeId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};