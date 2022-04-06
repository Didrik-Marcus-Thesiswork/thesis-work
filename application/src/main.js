// https://graphql.org/graphql-js/running-an-express-graphql-server/

import { schema, bookSchema } from './schema.js'
import { root, rootMysql, rootMongo } from './root-values.js'
import express  from 'express';
import { graphqlHTTP } from 'express-graphql';

var app = express();

function main(){

}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use('/books', graphqlHTTP ({
  schema: bookSchema,
  rootValue: rootMysql.books,
  graphiql: true
}))

main();

app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql');