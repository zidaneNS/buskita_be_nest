'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      address: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      creditScore: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15
      },
      roleId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      status: {
        type: Sequelize.DataTypes.ENUM,
        values: ['wait', 'approve', 'reject'],
        allowNull: false,
        defaultValue: 'wait'
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now(),
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now()
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
