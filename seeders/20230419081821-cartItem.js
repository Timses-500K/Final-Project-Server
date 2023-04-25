"use strict";

const { Cart, Item } = require("../models");
let cartId;
let itemId;

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Item.findOne({
      where:{
        itemName: "Sepatu Nike Stefanjanoski"
      }
    })
    .then(data => {
      itemId =data.id;
      return Cart.findOne({
        where: {
          id: 1
        }
      })
      .then(data => {
        return queryInterface.bulkInsert("CartItems",[
          {
            cartId: data.id,
            itemId,
            quantity: 5,
            createdAt: new Date(),
            updatedAt: new Date()
          },
        ])
      })
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CartItems', null, {});

  }
};