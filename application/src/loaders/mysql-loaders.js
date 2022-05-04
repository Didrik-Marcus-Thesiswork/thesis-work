import { dbMysql } from '../db.js';
import { groupBy, map } from 'ramda';
import DataLoader from 'dataloader';

const booksDataLoader = new DataLoader(keys => getBooksByLibraryIds(keys), {cache: false}) 
const librariansDataLoader = new DataLoader(keys => getLibrariansByLibraryIds(keys), {cache: false})

const queryDB = (sql, args) => new Promise((resolve, reject) => {
    dbMysql.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

const getBooksByLibraryIds = async (libraryIds) => {
    const query = "select * from books where library_id IN(?)"
    const books = await queryDB(query, [libraryIds]).then(data => data)

    // Group books by library ids
    const groupedById = groupBy(book => book.library_id, books)

    // Map books in the order of the library ids
    const mappedByID = map(libraryId => groupedById[libraryId], libraryIds)

    console.log("I made a request")

    return mappedByID
}

const getLibrariansByLibraryIds = async (libraryIds) => {
    const query = "select * from librarians where library_id IN(?)"
    const librarians = await queryDB(query, [libraryIds]).then(data => data)

    // Group books by library ids
    const groupedById = groupBy(librarian => librarian.library_id, librarians)

    // Map books in the order of the library ids
    const mappedByID = map(libraryId => groupedById[libraryId], libraryIds)

    console.log("I made a request")
    
    return mappedByID
}
export {booksDataLoader, librariansDataLoader}