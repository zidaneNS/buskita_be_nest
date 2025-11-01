'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      roleId: {
        type: DataType.INTEGER,
        allowNull: false
      },
      name: {
        type: DataType.STRING
      },
      createdAt: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Date.now()
      },
      updatedAt: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Date.now()
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};
