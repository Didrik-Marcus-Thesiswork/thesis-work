import { buildSchema, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
// Construct a schema, using GraphQL schema language

/**
 * Schemas are built to map data from graphQl to a js object.
   For every nested object we need to create a type for it aswell,
   bookschema is a great example-
 * When fetching from graphql we need to always provide a parameter for every object.
   getBooks {
     _id
     title
     category
     authors {
       name
       age
    }
  }
 */

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var bookSchema = buildSchema(`
  type Book {
    _id: ID 
    title: String
    category: String
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

var librariesSchema = buildSchema(`
  type Library {
    id : ID,
    name : String,
    street : String,
    books: [Book],
    librarians: [Librarian]
  }
  type Book {
    title : String,
    release_year : Int,
    library_id : ID
  }
  type Librarian {
    name: String,
    age: Int,
    library_id : ID
  }
  type Query {
    getLibraries: [Library]
    getLibrariesWithBooks: [Library]
    getLibrariesWithBooksAndLibrarians: [Library]
  }
`)

export { librariesSchema }