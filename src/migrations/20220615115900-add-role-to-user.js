'use strict';

const { USER_ROLES } = require('../config/const.js');

module.exports = {

   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('Users', 'role', {
         type: Sequelize.ENUM,
         values: [
            USER_ROLES.USER,
            USER_ROLES.ADMIN
         ],
         allowNull: false,
         defaultValue: USER_ROLES.USER
      });
   },
   
   async down(queryInterface) {
      await queryInterface.removeColumn('Users', 'role');
   }

};