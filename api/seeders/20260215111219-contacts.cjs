'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Contacts',
      [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '(11) 99999-1111',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Maria Santos',
          email: 'maria.santos@email.com',
          phone: '(11) 99999-2222',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Carlos Oliveira',
          email: 'carlos.oliveira@email.com',
          phone: '(11) 99999-3333',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Ana Costa',
          email: 'ana.costa@email.com',
          phone: '(11) 99999-4444',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440005',
          name: 'Pedro Ferreira',
          email: 'pedro.ferreira@email.com',
          phone: '(11) 99999-5555',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Contacts', null, {});
  },
};
