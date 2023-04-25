"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          categoryName: "High",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryName: "Low",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryName: "Skate",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryName: "Running",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryName: "Casual",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryName: "Basket",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryName: "FootBall",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryName: "Gym",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryName: "Jordan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryName: "Sandals",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
