"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Leads",
      [
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          contactId: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Projeto E-commerce',
          company: 'Tech Solutions Ltda',
          status: 'novo',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440002',
          contactId: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Sistema de Gestão',
          company: 'Inovação Digital S.A.',
          status: 'contactado',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440003',
          contactId: '550e8400-e29b-41d4-a716-446655440003',
          name: 'App Mobile',
          company: 'StartUp Brasil',
          status: 'qualificado',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440004',
          contactId: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Portal Corporativo',
          company: 'Mega Corp',
          status: 'convertido',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440005',
          contactId: '550e8400-e29b-41d4-a716-446655440005',
          name: 'Integração API',
          company: 'Conexão Tech',
          status: 'perdido',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Leads", null, {});
  },
};
