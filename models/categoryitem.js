'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryItem extends Model {

    static associate(models) {
      CategoryItem.belongsTo(models.Item,{foreignKey: "itemId"});
      CategoryItem.belongsTo(models.Category,{foreignKey: "categoryId"});
    }
  }
  CategoryItem.init({
    itemId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CategoryItem',
  });
  return CategoryItem;
};