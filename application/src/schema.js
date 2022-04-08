import { buildSchema, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
// Construct a schema, using GraphQL schema language

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var bookSchema = buildSchema(`
  type Book {
    id: ID 
    title: String
    authors: [Author]
  }
  type Author {
    name: String
    age: Int
  }
  type Query {
    getBooks: [Book],
    getBookInfo(id: Int): Book
  }
`);
var fooSchema = buildSchema(`
  type Foo {
    foo: String,
    bar: String
  }
  type Query {
    getFoos: [Foo]
  }
`)

export { schema, bookSchema, fooSchema }