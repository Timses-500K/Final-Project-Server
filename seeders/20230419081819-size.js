"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Sizes", [
      {
        size: "38",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        size: "39",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        size: "40",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        size: "41",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        size: "42",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        size: "35",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        size: "44",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        size: "43",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        size: "45",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        size: "46",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Sizes", null, {});
  },
};
