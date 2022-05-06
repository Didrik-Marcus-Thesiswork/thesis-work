import { faker } from '@faker-js/faker';
import { dbMysql, dbMongo } from './db.js'

async function main(amount) {
    // Recreate the content of databases
    await cleanDatabases()

    for(let libraryId = 1; libraryId < (amount+1); libraryId++){
       
        const { library, books, librarians } = generatedFakeData((amount+1),libraryId)

        await insertToMySQL(library, books, librarians)
        await insertToMongo(library, books, librarians)

        console.log("done")
    }
    return
}
async function insertToMongo(library, books, librarians) {

    console.log("inserting into mongo...")
    await dbMongo.collection("libraries").insertOne(library)
    await dbMongo.collection("books").insertMany(books)
    await dbMongo.collection("librarians").insertMany(librarians)
}

async function insertToMySQL(library, books, librarians) {
    const mySQLBooks = []
    const mySQLLibrarians = []
    books.forEach(book => {
        mySQLBooks.push(Object.values(book))
        
    });
    librarians.forEach(librarian => {
        mySQLLibrarians.push(Object.values(librarian))
    });

    console.log("inserting into mysql...")
    dbMysql.query("INSERT INTO libraries (name, street) VALUES(?, ?)", [library.name, library.street])
    dbMysql.query("INSERT INTO books (title, release_year, library_id) VALUES ?", [mySQLBooks])
    dbMysql.query("INSERT INTO librarians (name, age, library_id) VALUES ?", [mySQLLibrarians])
}

function generatedFakeData(amount, libraryId){

    const library = {
        name: faker.company.companyName(),
        street: faker.address.city(),
    }

    const books = []
    const librarians = []

     // generate fake data for librarians and books
    for(let i = 1; i < amount; i++){

        // create entries in memory
        books.push({
            title: faker.hacker.phrase(),
            release_year: faker.datatype.number({min: 1000, max: 2022}),
            library_id: libraryId
        })

        librarians.push({
            name: faker.name.findName(),
            age: faker.datatype.number({min: 10, max: 100}),
            library_id: libraryId
        })
    }
    return { library, books, librarians }
}

async function cleanDatabases(){

    console.log('Dropping tables...')

    dbMysql.query("DROP TABLE IF EXISTS books")
    dbMysql.query("DROP TABLE IF EXISTS librarians")
    dbMysql.query("DROP TABLE IF EXISTS libraries")
    
    console.log("Recreating tables...")

    dbMysql.query(`
        CREATE TABLE IF NOT EXISTS libraries(
        id INT AUTO_INCREMENT NOT NULL,
        name VARCHAR(200) NOT NULL,
        street VARCHAR(200) NOT NULL,
        PRIMARY KEY (id)
    )`)
    dbMysql.query(`
        CREATE TABLE IF NOT EXISTS books(
        id INT AUTO_INCREMENT NOT NULL,
        library_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        release_year INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (library_id) REFERENCES libraries(id)
    )`)
    dbMysql.query(`
        CREATE TABLE IF NOT EXISTS librarians(
        id INT AUTO_INCREMENT NOT NULL,
        library_id INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        age INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (library_id) REFERENCES libraries(id)
    )`)

    console.log('Recreating collections...')

    const booksResult = await dbMongo.collection("books").drop()
    if(booksResult){
        await dbMongo.createCollection("books")
    }
    const librariansResult = await dbMongo.collection("librarians").drop()
    if(librariansResult){
        await dbMongo.createCollection("librarians")
    }
    const librariesResult = await dbMongo.collection("libraries").drop()
    if(librariesResult){
        await dbMongo.createCollection("libraries")
    }
}
dbMongo.c
await main(10)
console.log("all entries inserted...")