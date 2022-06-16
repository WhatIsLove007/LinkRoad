'use strict';

const { CREDIT_CARDS } = require('../config/const.js');

module.exports = {

   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('Users', {
         id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
         },
         email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
         },
         hashedPassword: {
            type: Sequelize.STRING,
            allowNull: false
         },
         mobile: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
         },
         firstNameOnCard: {
            type: Sequelize.STRING
         },
         lastNameOnCard: {
            type: Sequelize.STRING
         },
         creditCard: {
            type: Sequelize.ENUM,
            values: [
               CREDIT_CARDS.AMERICAN_EXPRESS,
               CREDIT_CARDS.DISCOVER,
               CREDIT_CARDS.JCB,
               CREDIT_CARDS.MASTERCARD,
               CREDIT_CARDS.VISA
            ]
         },
         cardNumber: {
            type: Sequelize.STRING,
            unique: true
         },
         sid: {
            type: Sequelize.STRING
         },
         city: {
            type: Sequelize.STRING
         },
         zipCode: {
            type: Sequelize.STRING
         },
         address1: {
            type: Sequelize.STRING
         },
         address2: {
            type: Sequelize.STRING
         },
         createdAt: {
            type: Sequelize.DATE,
            allowNull: false
         }
      });
   },
   
   async down(queryInterface) {
      await queryInterface.dropTable('Users');
   }
   
};