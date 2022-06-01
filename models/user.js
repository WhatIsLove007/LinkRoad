import { Model } from 'sequelize';

import { CREDIT_CARDS } from '../config/const.js';


export default class User extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      firstNameOnCard: {
        type: DataTypes.STRING,
      },
      lastNameOnCard: {
        type: DataTypes.STRING,
      },
      creditCard: {
        type: DataTypes.ENUM,
        values: [
          CREDIT_CARDS.AMERICAN_EXPRESS,
          CREDIT_CARDS.DISCOVER,
          CREDIT_CARDS.JCB,
          CREDIT_CARDS.MASTERCARD,
          CREDIT_CARDS.VISA
        ],
      },
      cardNumber: {
        type: DataTypes.STRING,
        unique: true,
      },
      sid: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      zipCode: {
        type: DataTypes.STRING,
      },
      address1: {
        type: DataTypes.STRING,
      },
      address2: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {updatedAt: false, sequelize});
  }

  static associate(models) {
  }
  
};