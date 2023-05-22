'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Carts', 'deletedAt', {
        type: Sequelize.DATE,
        // allowNull: false,
        paranoid: true,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('Carts', 'deletedAt')]);
  },
};
