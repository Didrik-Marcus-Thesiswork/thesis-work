// https://graphql.org/graphql-js/running-an-express-graphql-server/

import { librariesSchema } from './schema.js'
import { rootMongo } from './root/mongo-root.js'
import { rootMysql } from './root/mysql-root.js'
import express  from 'express';
import { graphqlHTTP } from 'express-graphql';

var app = express();

function main(){

}

app.use('/libraries/mysql', graphqlHTTP ({
  schema: librariesSchema,
  rootValue: rootMysql.libraries,
  graphiql: true
}))

app.use('/libraries/mongo', graphqlHTTP ({
  schema: librariesSchema,
  rootValue: rootMongo.libraries,
  graphiql: true
}))

main();

app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/libraries/mongo');