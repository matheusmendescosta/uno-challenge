'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Leads', 'stageId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Stages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Leads', 'stageId');
  }
};
