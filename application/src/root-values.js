import { dbMysql, dbMongo } from './db.js';

const queryDB = (sql, args) => new Promise((resolve, reject) => {
    dbMysql.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

var root = {
    hello: () => {
        return 'Hello world!';
    },
};

var rootMysql = { 
    books: {
        title: () => {
            return 'Unknown';
        },
        author: () => {
            return 'Unknown';
        },
        getBooks: (args, req) => queryDB("select * from books", null).then(data => data),
        getBookInfo: (args, req) => queryDB("select * from books where id = ?", [args.id]).then(data => data[0])
    }
}
var rootMongo = {
    books: {
        title: () => {},
        getBooks: () => {
            return dbMongo.collection("books").find().toArray()
        },
        author: () => {
            return 'Unknown';
        },
        getBookInfo: (args, req) => "Not ready yet"
    },
    foo: {
        foo: () => {
            return "test"
        } ,
        getFoos: () => {
            return dbMongo.collection("foo").find().toArray()
            /*
            return [{
                "foo": "foo",
                "bar": "bar"
            }]
            */
        }
    },
    libraries: {
        getLibraries: () => {
            return dbMongo.collection("libraries").find().toArray()
        },
        getLibrariesWithBooks: async () => {
            //Fetch libraries
            var libraries = await dbMongo.collection("libraries").find().toArray()

            await getLibrariesWithBooks(libraries)

            return libraries
        },
        getLibrariesWithBooksAndLibrarians: async () => {
             //Fetch libraries
             var libraries = await dbMongo.collection("libraries").find().toArray()

             await getLibrariesWithBooksAndAutors(libraries)
 
             return libraries
        }
    }
}
const getLibrariesWithBooks = async (libraries) => {

    //Fetch all books per library
    for(let i = 0; i < libraries.length ; i ++ ){
        libraries[i].books = await dbMongo.collection("books").find({library_id : libraries[i].id}).toArray()
    }

    return libraries
}
const getLibrariesWithBooksAndAutors = async (libraries) => {
    
    //Fetch all books per library
    await getLibrariesWithBooks(libraries)
    
    //Fetch all librarians per library
    for(let i = 0; i < libraries.length; i++){
        libraries[i].librarians = await dbMongo.collection("librarians").find({library_id: libraries[i].id}).toArray()
    }

    return libraries
}

export { root, rootMysql, rootMongo }