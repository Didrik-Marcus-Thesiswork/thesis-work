const librariesSchema =`
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
    library(id: Int): Library
    libraries(limit: Int): [Library]
  }
`

export { librariesSchema }