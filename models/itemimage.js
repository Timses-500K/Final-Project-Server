'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemImage extends Model {
    static associate(models) {
      ItemImage.belongsTo(models.Item,{foreignKey: "itemId"});
    }
  }
  ItemImage.init({
    itemId: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ItemImage',
  });
  return ItemImage;
};