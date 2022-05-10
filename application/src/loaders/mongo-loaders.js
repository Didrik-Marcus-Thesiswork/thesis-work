import { dbMongo } from '../db.js';
import DataLoader from 'dataloader'
import { groupBy, map } from 'ramda'

const booksDataLoader = new DataLoader(keys => booksByLibraryIds(keys), {cache: false})
const librariansDataLoader = new DataLoader(keys => librariansByLibraryIds(keys), {cache: false})

async function booksByLibraryIds(libraryIds) {

    const books = await dbMongo.collection("books").find( {library_id : {$in : libraryIds} }).toArray()

    // group books to their respective library
    const groupedById = groupBy(book => book.library_id, books)

    // Map books in the order of the library ids
    const mappedById = map(library_id => groupedById[library_id], libraryIds)

    console.log("Book loader: I made a request")

    return mappedById
}

async function librariansByLibraryIds(libraryIds) {

    // fetch librarians by library id
    const librarians = await dbMongo.collection("librarians").find( {library_id : {$in : libraryIds} }).toArray()

    // group librarians to their respective library
    const groupedById = groupBy(librarians => librarians.library_id, librarians)

    // Map books in the order of the library ids
    const mappedByID = map(library_id => groupedById[library_id], libraryIds)

    console.log("Librarian loader: I made a request")

    return mappedByID
}

export { booksDataLoader, librariansDataLoader }