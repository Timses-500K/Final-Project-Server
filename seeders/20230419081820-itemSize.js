"use strict";

const { Item, Size } = require("../models");
let itemId;
let sizeId;

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Size.findOne({
      where:{
        size: "42"
      }
    })
    .then(data => {
      sizeId = data.id;
      return Item.findOne({
        where: {
          id: 1
        }
      })
      .then(data => {
        return queryInterface.bulkInsert("ItemSizes",[
          {
            itemId:data.id,
            sizeId,
            createdAt: new Date(),
            updatedAt: new Date()
          },
         
        ])
      })
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ItemSizes', null, {});

  }
};