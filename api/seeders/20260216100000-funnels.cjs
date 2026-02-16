'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const funnelId = uuidv4();
    
    // Create default funnel
    await queryInterface.bulkInsert('Funnels', [
      {
        id: funnelId,
        name: 'Funil de Vendas',
        description: 'Funil principal de vendas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create stages for the funnel
    const stages = [
      { name: 'Prospecção', order: 0, color: '#6B7280' },
      { name: 'Qualificação', order: 1, color: '#3B82F6' },
      { name: 'Proposta', order: 2, color: '#F59E0B' },
      { name: 'Negociação', order: 3, color: '#8B5CF6' },
      { name: 'Fechamento', order: 4, color: '#10B981' },
    ];

    await queryInterface.bulkInsert('Stages', 
      stages.map(stage => ({
        id: uuidv4(),
        funnelId: funnelId,
        name: stage.name,
        order: stage.order,
        color: stage.color,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Stages', null, {});
    await queryInterface.bulkDelete('Funnels', null, {});
  }
};
