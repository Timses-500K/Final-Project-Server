'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {

    static associate(models) {
      CartItem.belongsTo(models.Item,{foreignKey: "itemId"})
      CartItem.belongsTo(models.Cart,{foreignKey: "cartId"})
    }
  }
  CartItem.init({
    cartId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};