"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Leads", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      contactId: {
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
      },
      company: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM(
          "novo",
          "contactado",
          "qualificado",
          "convertido",
          "perdido",
        ),
        defaultValue: "novo",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Leads");
  },
};
