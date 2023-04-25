"use strict";

const { Item, Category } = require("../models");
let itemId;
let categoryId;

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Category.findOne({
      where:{
        categoryName: "Skate"
      }
    })
    .then(data => {
      categoryId = data.id;
      return Item.findOne({
        where: {
          id: 1
        }
      })
      .then(data => {
        return queryInterface.bulkInsert("CategoryItems",[
          {
            itemId: data.id,
            categoryId,
            createdAt: new Date(),
            updatedAt: new Date()
          },
         
        ])
      })
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CategoryItems', null, {});

  }
};