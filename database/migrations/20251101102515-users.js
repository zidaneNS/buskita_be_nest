'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userId: {
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataType.STRING,
        allowNull: false
      },
      email: {
        type: DataType.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataType.STRING,
        allowNull: false
      },
      phone_number: {
        type: DataType.STRING,
        unique: true,
        allowNull: false
      },
      address: {
        type: DataType.STRING,
        allowNull: false
      },
      credit_score: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 15
      },
      roleId: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 3
      },
      createdAt: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Date.now(),
      },
      updatedAt: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Date.now()
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
