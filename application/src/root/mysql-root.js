import { dbMysql} from '../db.js';

var rootMysql = { 
    libraries: {
        getLibraries: async (args, req) => {
            return queryDB("select * from libraries limit ?", [args.limit]).then(data => data)
        },
        getLibrariesWithBooks: async (args, req) => {
            var libraries = await queryDB("select * from libraries", null).then(data => data)

            await getLibrariesWithBooks(libraries)

            return libraries
        },
        getLibrariesWithBooksAndLibrarians: async (args, req) => {
            var libraries = await queryDB("select * from libraries", null).then(data => data)

            await getLibrariesWithBooksAndLibrarians(libraries)
 
            return libraries
        }
    }
}

const queryDB = (sql, args) => new Promise((resolve, reject) => {
    dbMysql.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

const getLibrariesWithBooks = async (libraries) => {

    //Fetch all books per library
    for(let i = 0; i < libraries.length ; i ++ ){
        libraries[i].books = await queryDB("select * from books where library_id = ?", [libraries[i].id]).then(data => data)
    }

    return libraries
}

const getLibrariesWithBooksAndLibrarians = async (libraries) => {
    
    //Fetch all books per library
    await getLibrariesWithBooks(libraries)
    
    //Fetch all librarians per library
    for(let i = 0; i < libraries.length; i++){
        libraries[i].librarians = await queryDB("select * from librarians where library_id = ?", [libraries[i].id]).then(data => data)
    }

    return libraries
}

export { rootMysql }