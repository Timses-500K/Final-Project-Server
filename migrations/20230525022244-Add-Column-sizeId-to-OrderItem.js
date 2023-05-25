'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('OrderItems', 'sizeId', {
        type: Sequelize.INTEGER,
        // allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "Sizes",
          key: "id",
        },
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('OrderItems', 'sizeId')]);
  },
};
