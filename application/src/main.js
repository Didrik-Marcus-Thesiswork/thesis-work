// https://graphql.org/graphql-js/running-an-express-graphql-server/

import { schema, bookSchema } from './schema.js'
import { root, rootBooks } from './root-values.js'
import express  from 'express';
import { graphqlHTTP } from 'express-graphql';
import {MongoClient, ObjectId} from 'mongodb';


const homePath = '/graphql'
const URL = 'http://localhost'
const PORT = 4000
const MONGO_URL = 'mongodb://localhost:27017'

// The root provides a resolver function for each API endpoint


var app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use('/books', graphqlHTTP ({
  schema: bookSchema,
  rootValue: rootBooks,
  graphiql: true
}))

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');