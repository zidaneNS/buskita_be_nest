'use strict';

const { v4: uuid } = require('uuid');
const routes = ['GSK-SBY', 'SBY-GSK'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('routes', routes.map(route => ({
    routeId: uuid(),
    name: route
   })));

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('routes', null, {});
  }
};
