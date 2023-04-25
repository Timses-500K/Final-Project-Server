"use strict";

const { Order, Item } = require("../models");
let orderId;
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
      return Order.findOne({
        where: {
          id: 2
        }
      })
      .then(data => {
        return queryInterface.bulkInsert("OrderItems",[
          {
            orderId: data.id,
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
    await queryInterface.bulkDelete('OrderItems', null, {});

  }
};