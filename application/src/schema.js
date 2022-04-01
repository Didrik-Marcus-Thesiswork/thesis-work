import { buildSchema, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
// Construct a schema, using GraphQL schema language

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var bookSchema = buildSchema(`
  type Book {
    id: ID!
    title: String
    author: String
  }
  type Query {
    getBooks: [Book],
    getBookInfo(id: Int): Book
  }
`);

export { schema, bookSchema }