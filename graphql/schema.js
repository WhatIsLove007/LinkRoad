import { _ } from 'lodash';
import { gql } from 'apollo-server-express';

import User from './types/user.js';

export const typeDefs = gql`

   ${User.typeDefs()}

   type LoginResponse {
      Authorization: String!
   }

   type Response {
      success: Boolean!
   }

   type Query {
      signin(email: String!, password: String!): LoginResponse
      getUser: User
   }

   type Mutation {
      signup(input: UserSignupInput!): User
   }
  
`;


function combineResolvers() {
   return _.merge(
      User.resolver(),
   )
}


export const resolvers = combineResolvers();