const dotenv = require('dotenv');
dotenv.config();

module.exports = {

   CREDIT_CARDS: {
      VISA: 'VISA',
      MASTERCARD: 'MASTERCARD',
      JCB: 'JCB',
      DISCOVER: 'DISCOVER',
      AMERICAN_EXPRESS: 'AMERICAN_EXPRESS'
   },

   ERROR_MESSAGES: {
      INCORRECT_EMAIL: 'Incorrect email',
      INCORRECT_PASSWORD: 'Incorrect password',
      PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
      EMAIL_ALREADY_EXISTS: 'Email already exists',
      MOBILE_ALREADY_EXISTS: 'Mobile already exists',
      SID_ALREADY_EXISTS: 'SID already exists',
      EMAIL_DOES_NOT_EXIST: 'Email does not exist',
      WRONG_PASSWORD: 'Wrong password',
      UNAUTHORIZED: 'Unauthorized'
   },

   USER_ROLES: {
      USER: 'USER',
      ADMIN: 'ADMIN'
   },

   JWT_SECRET: process.env.JWT_SECRET,
   JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME

};