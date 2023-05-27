"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Orders", "addressId", {
        type: Sequelize.INTEGER,
        // allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "Addresses",
          key: "id",
        },
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([queryInterface.removeColumn("Orders", "addressId")]);
  },
};
