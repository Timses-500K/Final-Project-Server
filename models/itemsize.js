'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemSize extends Model {

    static associate(models) {
      ItemSize.belongsTo(models.Item, {foreignKey: "itemId"});
      ItemSize.belongsTo(models.Size, {foreignKey: "sizeId"});
    }
  }
  ItemSize.init({
    itemId: DataTypes.INTEGER,
    sizeId: DataTypes.INTEGER,
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ItemSize',
  });
  return ItemSize;
};