"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "user01",
        email:"user01@gmail.com",
        password: "user01",
        firstName: "user01",
        lastName: "01",
        birth: new Date(),
        visibility: "True",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "user02",
        email:"user02@gmail.com",
        password: "user02",
        firstName: "user02",
        lastName: "02",
        birth: new Date(),
        visibility: "True",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "user03",
        email:"user03@gmail.com",
        password: "user03",
        firstName: "user03",
        lastName: "03",
        visibility: "True",
        birth: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
