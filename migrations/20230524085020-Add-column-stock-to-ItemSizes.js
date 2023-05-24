'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('ItemSizes', 'stock', {
        type: Sequelize.INTEGER,
        // allowNull: false,
        paranoid: true,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('ItemSizes', 'stock')]);
  },
};
