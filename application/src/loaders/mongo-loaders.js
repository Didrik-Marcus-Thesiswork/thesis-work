import { dbMongo } from '../db.js';
import Dataloader from 'dataloader'
import { groupBy, map } from 'ramda'

const booksDataloader = new Dataloader(keys => booksByLibraryIds(keys), {cache: false})
const librariansDataloader = new Dataloader(keys => librariansByLibraryIds(keys), {cache: false})

async function booksByLibraryIds(libraryIds) {
    console.log('booksByLibraryIds', libraryIds)
    // fetch books by library id
    const books = await dbMongo.collection("books").find( {library_id : {$in : libraryIds} }).toArray()

    // group books to their respective library
    const groupedById = groupBy(book => book.library_id, books)

    return map(library_id => groupedById[library_id], libraryIds)
}

async function librariansByLibraryIds(libraryIds) {
    console.log('librariansByLibraryIds', libraryIds)

    // fetch librarians by library id
    const librarians = await dbMongo.collection("librarians").find( {library_id : {$in : libraryIds} }).toArray()

    // group librarians to their respective library
    const groupedById = groupBy(librarians => librarians.library_id, librarians)

    return map(library_id => groupedById[library_id], libraryIds)
}

export { booksDataloader, librariansDataloader }