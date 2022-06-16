import { Model } from 'sequelize';
import { UserInputError } from 'apollo-server-express';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { CREDIT_CARDS, ERROR_MESSAGES, USER_ROLES, JWT_SECRET, JWT_EXPIRATION_TIME } from '../config/const.js';


export default class User extends Model {
   static init(sequelize, DataTypes) {
      return super.init({
         id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
         },
         email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
               isEmail: true
            }
         },
         hashedPassword: {
            type: DataTypes.STRING,
            allowNull: false
         },
         mobile: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
         },
         firstNameOnCard: {
            type: DataTypes.STRING
         },
         lastNameOnCard: {
            type: DataTypes.STRING
         },
         creditCard: {
            type: DataTypes.ENUM,
            values: [
               CREDIT_CARDS.AMERICAN_EXPRESS,
               CREDIT_CARDS.DISCOVER,
               CREDIT_CARDS.JCB,
               CREDIT_CARDS.MASTERCARD,
               CREDIT_CARDS.VISA
            ]
         },
         cardNumber: {
            type: DataTypes.STRING,
            unique: true
         },
         sid: {
            type: DataTypes.STRING
         },
         city: {
            type: DataTypes.STRING
         },
         zipCode: {
            type: DataTypes.STRING
         },
         address1: {
            type: DataTypes.STRING
         },
         address2: {
            type: DataTypes.STRING
         },
         createdAt: {
            type: DataTypes.DATE,
            allowNull: false
         },
         role: {
            type: DataTypes.ENUM,
            values: [
               USER_ROLES.USER,
               USER_ROLES.ADMIN
            ],
            allowNull: false,
            defaultValue: USER_ROLES.USER
         }
      }, {updatedAt: false, sequelize});
   }

   static validateEmail(email) {
      if (!validator.isEmail(email)) {
         throw new UserInputError(ERROR_MESSAGES.INCORRECT_EMAIL);
      }
   }

   static validatePassword(password) {
      if (!/^[a-zA-Z0-9_]{4,16}$/.test(password)) {
         throw new UserInputError(ERROR_MESSAGES.INCORRECT_PASSWORD);
      }
   }
   
   static async authenticateUser(token) {
      try {
         const decoded = jwt.verify(token, JWT_SECRET);
         
         const user = await this.findOne({where: {id: decoded.id, email: decoded.email}});
         
         return user;
         
      } catch (error) {
         return null;
      }
   }

   static async hashPassword(password) {
      return bcrypt.hash(password, 10);
   }

   async comparePasswords(password) {
      if (!bcrypt.compare(password, this.password)) {
         throw new UserInputError(ERROR_MESSAGES.WRONG_PASSWORD);
      }
   }

   generateAccessToken() {
      return jwt.sign({id: this.id, email: this.email}, JWT_SECRET, {expiresIn: JWT_EXPIRATION_TIME});
   }
   
   getRole() {
      return this.role;
   }

}