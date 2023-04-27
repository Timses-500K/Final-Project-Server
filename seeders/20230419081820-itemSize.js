"use strict";

const { Item, Size } = require("../models");
let itemId;
let sizeId;

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sizes = ["38", "39", "40", "41"];
    const sizeObjs = await Promise.all(sizes.map(size => {
      return Size.findOrCreate({
        where: { size }
      });
    }));
    const item = await Item.findOne({
      where: { id: 1 }
    });
    itemId = item.id;
    const itemSizes = sizeObjs.map(sizeObj => {
      sizeId = sizeObj[0].id;
      return {
        itemId,
        sizeId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    return queryInterface.bulkInsert("ItemSizes", itemSizes);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ItemSizes', null, {});
    await Size.destroy({ where: { size: ["38", "39", "40", "41"] }});
  }
};
