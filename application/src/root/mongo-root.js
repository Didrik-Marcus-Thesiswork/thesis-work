import { dbMongo } from '../db.js';

var rootMongo = {
    libraries: {
        getLibraries: (args, req) => {
            return dbMongo.collection("libraries").find().limit(args.limit).toArray()
        },
        getLibrariesWithBooks: async (args, req) => {
            //Fetch libraries
            var libraries = await dbMongo.collection("libraries").find().toArray()

            await getLibrariesWithBooks(libraries)

            return libraries
        },
        getLibrariesWithBooksAndLibrarians: async (args, req) => {
            //Fetch libraries
            var libraries = await dbMongo.collection("libraries").find().toArray()

            await getLibrariesWithBooksAndLibrarians(libraries)
 
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
const getLibrariesWithBooksAndLibrarians = async (libraries) => {
    
    //Fetch all books per library
    await getLibrariesWithBooks(libraries)
    
    //Fetch all librarians per library
    for(let i = 0; i < libraries.length; i++){
        libraries[i].librarians = await dbMongo.collection("librarians").find({library_id: libraries[i].id}).toArray()
    }

    return libraries
}

export { rootMongo }