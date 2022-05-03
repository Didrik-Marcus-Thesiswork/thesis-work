import { buildSchema } from 'graphql';

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
    getLibrariesWithBooksDataload : [Library]
  }
`)

export { librariesSchema }