import { defaultFieldResolver } from 'graphql';
import { AuthenticationError } from 'apollo-server-express';
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';

import { ERROR_MESSAGES } from '../config/const.js';

export function authDirective(schema) {

   return mapSchema(schema, {

      [MapperKind.OBJECT_FIELD]: fieldConfig => {

         const authDirective = getDirective(schema, fieldConfig, 'auth');

         if (authDirective) {
            const { resolve = defaultFieldResolver } = fieldConfig;

            fieldConfig.resolve = async function (source, args, context, info) {
               const requiredRole = authDirective[0].requires;

               const user = context.user;
               if (!user) throw new AuthenticationError(ERROR_MESSAGES.UNAUTHORIZED);

               const userRole = user.getRole();

               const isAuthorized = requiredRole.indexOf(userRole) !== -1;
               if (!isAuthorized) {
                  throw new AuthenticationError(`Access is denied. You need following role: ${requiredRole}`);
               }

               return await resolve(source, args, context, info);
            };
            
            return fieldConfig;
         }
      }

   });

}