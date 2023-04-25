'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {

    static associate(models) {
      Item.belongsToMany(models.Cart,{foreignKey: "itemId", through: models.CartItem, as: "itemCart"});
      Item.belongsToMany(models.Size,{foreignKey: "itemId", through: models.ItemSize, as: "itemSize"});
      Item.belongsToMany(models.Order,{foreignKey: "itemId", through: models.OrderItem, as: "itemOrder"})
      Item.belongsToMany(models.Category,{foreignKey: "itemId", through: models.CategoryItem, as: "itemCategory"})
    }
  }
  Item.init({
    itemName: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    imageUrl: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    color: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};