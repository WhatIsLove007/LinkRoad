import { _ } from 'lodash';
import { gql } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { authDirective } from './directives.js';
import models from '../models';
import User from './types/user.js';
import { USER_ROLES } from '../config/const.js';

const typeDefs = gql`

   directive @auth(requires: [UserRoles]) on FIELD_DEFINITION

   ${User.typeDefs()}

   type LoginResponse {
      Authorization: String!
   }

   type Response {
      success: Boolean!
   }

   type Query {
      signin(email: String!, password: String!): LoginResponse
      getUser(id: Int!): User @auth(requires: [${USER_ROLES.ADMIN}])
   }

   type Mutation {
      signup(input: UserSignupInput!): LoginResponse
   }
  
`;

function combineResolvers() {
   return _.merge(
      User.resolver()
   );
}

export let schema = makeExecutableSchema({
   typeDefs,
   resolvers: combineResolvers()
});

schema = authDirective(schema);


export const context = async context => {

   const bearerToken = context.req.headers.authorization;

   const token = bearerToken? bearerToken.split(' ')[1] : null;
   if (!token) {
      context.user = null;
      return context;
   }
 
   context.user = await models.User.authenticateUser(token);
   
   return context;
};