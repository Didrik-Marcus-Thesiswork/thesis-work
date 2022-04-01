import { buildSchema, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
// Construct a schema, using GraphQL schema language

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var bookSchema = buildSchema(`
  type Query {
    title: String
    author: String
  }
`);

export { schema, bookSchema }