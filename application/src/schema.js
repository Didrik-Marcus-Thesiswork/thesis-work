import { buildSchema } from 'graphql';
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
    getLibraries(limit: Int): [Library]
    getLibrariesWithBooks: [Library]
    getLibrariesWithBooksAndLibrarians: [Library]
  }
`)

export { librariesSchema }