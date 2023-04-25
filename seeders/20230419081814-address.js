"use strict";
const { User } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return User.findOne({
      where: {
        username: "user01",
      },
    }).then((data) => {
      return queryInterface.bulkInsert("Addresses", [
        {
          userId: data.id,
          addressName: "Nando",
          address: "jl.cempaka",
          city: "Bandung",
          postalCode: 45612,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: data.id,
          addressName: "Azhar",
          address: "jl.ponorogo",
          city: "Yogyakarta",
          postalCode: 31143,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Addresses", null, {});
  },
};
