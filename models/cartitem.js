'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {

    static associate(models) {
      CartItem.belongsTo(models.Item,{foreignKey: "itemId"})
      CartItem.belongsTo(models.Cart,{foreignKey: "cartId"})
      CartItem.belongsTo(models.Size,{foreignKey: "sizeId"})
    }
  }
  CartItem.init({
    cartId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    sizeId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};