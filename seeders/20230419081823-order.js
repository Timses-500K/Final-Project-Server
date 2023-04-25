"use strict";

const {User} = require('../models')


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return User.findOne({
      where: {
        username: "user01",
      },
    }).then((data) => {
      return queryInterface.bulkInsert("Orders", [
        {
          userId: data.id,
          subtotal: 80291,
          totalPrice: 83000,
          status: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },      
        {
          userId: data.id,
          subtotal: 101291,
          totalPrice: 102500,
          status: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },    
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
