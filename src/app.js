import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { schema, context } from './graphql/schema.js';


const app = express();
const PORT = process.env.PORT || 3000;


async function startApolloServer() {
   const apolloServer = new ApolloServer({schema, context});
   await apolloServer.start();
   apolloServer.applyMiddleware({app});
}
startApolloServer();

app.use(express.json());


app.listen(PORT, error => error? console.log(error) : console.log(`Server has been started on PORT ${PORT}...`));