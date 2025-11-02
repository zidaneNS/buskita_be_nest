'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('buses', {
      busId: {
        type: DataType.UUIDV4,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataType.STRING,
        allowNull: false,
        unique: true
      },
      total_row: {
        type: DataType.INTEGER,
        allowNull: false
      },
      total_col: {
        type: DataType.INTEGER,
        allowNull: false
      },
      total_backseat: {
        type: DataType.INTEGER
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
    await queryInterface.dropTable('buses');
  }
};
