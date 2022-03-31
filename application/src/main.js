// https://graphql.org/graphql-js/running-an-express-graphql-server/

var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var {MongoClient, ObjectId} = require('mongodb')

const homePath = '/graphql'
const URL = 'http://localhost'
const PORT = 4000
const MONGO_URL = 'mongodb://localhost:27017'

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

var app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');