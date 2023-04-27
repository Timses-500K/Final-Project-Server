"use strict";

const { User, Address } = require("../models");
let userId;
let addressId;

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return User.findOne({
      where:{
        username: "user01"
      }
    })
    .then(data => {
      userId =data.id;
      return Address.findOne({
        where: {
          city: "Bandung"
        }
      })
      .then(data => {
        return queryInterface.bulkInsert("Carts",[
          {
            userId,
            addressId: data.id,
            totalPrice: 90000,
            visibility: "True",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            userId,
            addressId: data.id,
            totalPrice: 70000,
            visibility: "True",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ])
      })
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carts', null, {});

  }
};