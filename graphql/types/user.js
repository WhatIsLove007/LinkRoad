import { gql, UserInputError } from 'apollo-server-express';

import models from '../../models';
import { CREDIT_CARDS, GRAPHQL_ERROR_MESSAGES } from '../../config/const';
import * as inputDataValidation from '../../utils/inputDataValidation.js';
import * as secretDataConversion from '../../utils/secretDataConversion.js';


export default class Order {
   
   static resolver() {
      return {
         
         Query: {
            
            getUser: async (parent, {}, context) => {
               
            },

            signin: async (parent, { email, password }) => {
            
               if (!inputDataValidation.validateEmail(email)) {
                  throw new UserInputError(GRAPHQL_ERROR_MESSAGES.INCORRECT_EMAIL);
               }
               if (!inputDataValidation.validatePassword(password)) {
                  throw new UserInputError(GRAPHQL_ERROR_MESSAGES.INCORRECT_PASSWORD);
               }
            
               const user = await models.User.findOne({where: email});
               if (!user) throw new Error(GRAPHQL_ERROR_MESSAGES.EMAIL_DOES_NOT_EXIST);
            
               if ( !(await secretDataConversion.compare(password, user.hashedPassword)) ) {
                  throw new UserInputError(GRAPHQL_ERROR_MESSAGES.WRONG_PASSWORD);
               }

               return {Authorization};
               
            }
            
         },
         
         Mutation: {
            
            signup: async (parent, { input }) => {
               
               const {
                  email, mobile, password, confirmPassword, sid, 
                  userCardInformation, userAddressInformation
               } = input;


               if (!inputDataValidation.validateEmail(email)) {
                  throw new UserInputError(GRAPHQL_ERROR_MESSAGES.INCORRECT_EMAIL);
               }
               if (!inputDataValidation.validatePassword(password)) {
                  throw new UserInputError(GRAPHQL_ERROR_MESSAGES.INCORRECT_PASSWORD);
               }
               if (password !== confirmPassword) {
                  throw new UserInputError(GRAPHQL_ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH);
               }

               const existingEmail = await models.User.findOne({where: {email}});
               if (existingEmail) throw new Error(GRAPHQL_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);

               const existingPhone = await models.User.findOne({where: {mobile}});
               if (existingPhone) throw new Error(GRAPHQL_ERROR_MESSAGES.MOBILE_ALREADY_EXISTS);

               const existingSid = await models.User.findOne({where: {sid}});
               if (existingSid) throw new Error(GRAPHQL_ERROR_MESSAGES.SID_ALREADY_EXISTS);


               return models.User.create({
                  email,
                  mobile,
                  hashedPassword: await secretDataConversion.hash(password),
                  ...(sid? {sid} : {}),
                  ...(userCardInformation? {
                     firstNameOnCard: userCardInformation.firstNameOnCard,
                     lastNameOnCard: userCardInformation.lastNameOnCard,
                     creditCard: userCardInformation.creditCard,
                     cardNumber: userCardInformation.cardNumber,
                  } : {}),
                  ...(userAddressInformation? {
                     city: userAddressInformation.city,
                     zipCode: userAddressInformation.zipCode,
                     address1: userAddressInformation.address1,
                     ...(userAddressInformation.address2? {address2: userAddressInformation.address2} : {}),
                  } : {}),
               });

            },
            

         },
      }
   }
   
   
   static typeDefs() {
      return gql`

         type User {
            id: Int
            email: String
            mobile: String
            firstNameOnCard: String
            lastNameOnCard: String
            creditCard: CreditCard
            cardNumber: String
            sid: String
            city: String
            zipCode: String
            address1: String
            address2: String
            createdAt: String
         }
         
         enum CreditCard {
            ${CREDIT_CARDS.AMERICAN_EXPRESS}
            ${CREDIT_CARDS.DISCOVER}
            ${CREDIT_CARDS.JCB}
            ${CREDIT_CARDS.MASTERCARD}
            ${CREDIT_CARDS.VISA}
         }

         input UserSignupInput {
            email: String!
            mobile: String!
            password: String!
            confirmPassword: String!
            userCardInformation: UserCardInformationInput
            sid: String
            userAddressInformation: UserAddressInformationInput
         }

         input UserCardInformationInput {
            firstNameOnCard: String!
            lastNameOnCard: String!
            creditCard: CreditCard!
            cardNumber: String!
         }

         input UserAddressInformationInput {
            city: String!
            zipCode: String!
            address1: String!
            address2: String
         }

      `
   }

}