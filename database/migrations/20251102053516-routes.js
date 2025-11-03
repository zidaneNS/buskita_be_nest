'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('routes', {
      routeId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.DataTypes.ENUM(['GSK-SBY', 'SBY-GSK']),
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now()
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now()
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('routes');
  }
};
