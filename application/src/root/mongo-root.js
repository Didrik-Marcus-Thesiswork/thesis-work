import { dbMongo } from '../db.js';

var rootMongo = {
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

            await getLibrariesWithBooksAndAuthors(libraries)
 
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
const getLibrariesWithBooksAndAuthors = async (libraries) => {
    
    //Fetch all books per library
    await getLibrariesWithBooks(libraries)
    
    //Fetch all librarians per library
    for(let i = 0; i < libraries.length; i++){
        libraries[i].librarians = await dbMongo.collection("librarians").find({library_id: libraries[i].id}).toArray()
    }
    console.log(libraries)
    return libraries
}

export { rootMongo }