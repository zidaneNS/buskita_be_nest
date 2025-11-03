'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('buses', {
      busId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      totalRow: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      totalCol: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      totalBackseat: {
        type: Sequelize.DataTypes.INTEGER
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
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('buses');
  }
};
