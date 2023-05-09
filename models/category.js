'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {

    static associate(models) {
      Category.belongsToMany(models.Item,{foreignKey: "categoryId", through: models.CategoryItem, as: "categoryItem"});
      Category.hasMany(models.CategoryItem,{foreignKey:"categoryId"});
    }
  }
  Category.init({
    categoryName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};