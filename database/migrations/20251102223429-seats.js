'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('seats', {
      seatId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      busId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.DataTypes.STRING
      },
      scheduleId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      seatNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      verified: {
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('seats');
  }
};
