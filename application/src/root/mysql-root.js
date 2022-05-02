import { dbMysql} from '../db.js';

var rootMysql = { 
    libraries: {
        getLibraries: async (args, req) => {
            return queryDB("select * from libraries limit ?", [args.limit]).then(data => data)
        },
        getLibrariesWithBooks: async (args, req) => {
            var libraries = await queryDB("select * from libraries", null).then(data => data)

            await getBooksByLibraries(libraries)

            return libraries
        },
        getLibrariesWithBooksAndLibrarians: async (args, req) => {
            var libraries = await queryDB("select * from libraries", null).then(data => data)

            await getBooksAndLibrariansByLibraries(libraries)
 
            return libraries
        },
        getLibrariesWithBooksDataload: async (args, req) => {
            var libraries = await queryDB("select * from libraries", null).then(data => data)
            console.log(libraries)
            //Push keys into an array
            var keys = []
            for(let library of libraries){
                keys.push(library.id)
            }
            
            const books = await getBooksByLibraryIds(keys)

            const groupedBooks = groupByLibraryId(books)
            console.log(groupedBooks)
            return libraries
        },
        getLibrariesWithBooksAndLibrariansDataload: async (args, req) => {
            var libraries = await queryDB("select * from libraries", null).then(data => data)

            var keys = []
            for(library in libraries){
                keys.push(library.id)
            }

            const {books, librarians} = await getBooksAndLibrariansByLibraryIds(keys)
            
            return libraries
        },
    }
}

const queryDB = (sql, args) => new Promise((resolve, reject) => {
    dbMysql.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

const getBooksByLibraries = async (libraries) => {

    //Fetch all books per library
    for(let i = 0; i < libraries.length ; i ++ ){
        libraries[i].books = await queryDB("select * from books where library_id = ?", [libraries[i].id]).then(data => data)
    }

    return libraries
}

const getBooksAndLibrariansByLibraries = async (libraries) => {
    
    //Fetch all books per library
    await getLibrariesWithBooks(libraries)
    
    //Fetch all librarians per library
    for(let i = 0; i < libraries.length; i++){
        libraries[i].librarians = await queryDB("select * from librarians where library_id = ?", [libraries[i].id]).then(data => data)
    }

    return libraries
}

const getBooksByLibraryIds = async (libraryIds) => {

    const books = await queryDB("select * from books where library_id IN(?)", [libraryIds]).then(data => data)

    return books
}

const getBooksAndLibrariansByLibraryIds = async (libraryIds) => {
    
    //Fetch all books
    const books = await getBooksByLibraryIds(libraryIds)

    //Fetch all librarians
    const librarians = await queryDB("select * from librarians where library_id = ANY(?)", libraryIds).then(data => data)

    return {books, librarians}
}

const groupByLibraryId = (objects) => {
    //TODO
}

export { rootMysql }