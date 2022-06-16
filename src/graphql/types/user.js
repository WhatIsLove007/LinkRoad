import { gql, UserInputError, AuthenticationError } from 'apollo-server-express';

import models from '../../models';
import { CREDIT_CARDS, ERROR_MESSAGES, USER_ROLES } from '../../config/const';


export default class Order {
   
   static resolver() {
      return {
         
         Query: {
            getUser: async (parent, { id }) => models.User.findByPk(id),

            signin: async (parent, { email, password }) => {
            
               models.User.validateEmail(email);
               models.User.validatePassword(password);

               const user = await models.User.findOne({where: {email}});
               if (!user) throw new AuthenticationError(ERROR_MESSAGES.EMAIL_DOES_NOT_EXIST);
            
               await user.comparePasswords(password);

               return {Authorization: user.generateAccessToken()};
            }
         },
         
         Mutation: {
            signup: async (parent, { input }) => {
               
               const {
                  email, mobile, password, confirmPassword, sid, 
                  userCardInformation, userAddressInformation
               } = input;

               models.User.validateEmail(email);
               models.User.validatePassword(password);

               if (password !== confirmPassword) throw new UserInputError(ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH);

               const existingEmail = await models.User.findOne({where: {email}});
               if (existingEmail) throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);

               const existingPhone = await models.User.findOne({where: {mobile}});
               if (existingPhone) throw new Error(ERROR_MESSAGES.MOBILE_ALREADY_EXISTS);

               const existingSid = await models.User.findOne({where: {sid}});
               if (existingSid) throw new Error(ERROR_MESSAGES.SID_ALREADY_EXISTS);

               const user = await models.User.create({
                  email,
                  mobile,
                  hashedPassword: await models.User.hashPassword(password),
                  ...(sid? {sid} : {}),
                  ...(userCardInformation? {
                     firstNameOnCard: userCardInformation.firstNameOnCard,
                     lastNameOnCard: userCardInformation.lastNameOnCard,
                     creditCard: userCardInformation.creditCard,
                     cardNumber: userCardInformation.cardNumber
                  } : {}),
                  ...(userAddressInformation? {
                     city: userAddressInformation.city,
                     zipCode: userAddressInformation.zipCode,
                     address1: userAddressInformation.address1,
                     ...(userAddressInformation.address2? {address2: userAddressInformation.address2} : {})
                  } : {})
               });

               return {Authorization: user.generateAccessToken()};

            }
            

         }
      };
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
            role: UserRoles
         }
         
         enum CreditCard {
            ${CREDIT_CARDS.AMERICAN_EXPRESS}
            ${CREDIT_CARDS.DISCOVER}
            ${CREDIT_CARDS.JCB}
            ${CREDIT_CARDS.MASTERCARD}
            ${CREDIT_CARDS.VISA}
         }

         enum UserRoles {
            ${USER_ROLES.USER}
            ${USER_ROLES.ADMIN}
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

      `;
   }

}