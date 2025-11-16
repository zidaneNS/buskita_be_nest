'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('schedules', {
      scheduleId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      time: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      busId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      routeId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      isClosed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    });

    await queryInterface.createTable('schedule_user', {
      scheduleId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('schedules');
    await queryInterface.dropTable('schedule_user');
  }
};
