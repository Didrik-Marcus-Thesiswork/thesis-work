import { faker } from '@faker-js/faker';
import { dbMysql, dbMongo } from './db.js'

async function fakerData(entries) {

    await cleanDatabases()

    // libraries loop
    for(let libraryId = 1; libraryId < entries; libraryId++){
        const results = {}

        const library = {
            name: faker.company.companyName(),
            street: faker.address.city(),
        }

        console.log(`Inserting the following library: `, library)
        results.mySQL = await queryDB("INSERT INTO libraries (name, street) VALUES (?,?)", [library.name, library.street]).then(data => data)
        results.mongo = await dbMongo.collection("libraries").insertOne(library)
       
        const { books, librarians } = generatedFakeData(entries,libraryId)

        console.log('first book',books[0])
        console.log('first librarian', librarians[0])
        return

        console.log(`Inserting the following books into library ${libraryId}: `, books)
        return

        await dbMongo.collection("books").insertMany(books)
        await dbMysql.query("INSERT INTO books (name, release_year, library_id) VALUES ?", [books])

        console.log(`Inserting the following librarians into library ${i}: `, librarians)
        await dbMongo.collection("librarians").insertMany(librarians)
        await dbMysql.query("INSERT INTO librarians (name, age, library_id) VALUES ?", [librarians])
    }

    
}

function generatedFakeData(amount, libraryId){

    const books = []
    const librarians = []

     // generate fake data for librarians and books
    for(let i = 1; i < (amount+1); i++){

        // create entries in memory
        books.push({
            name: faker.name.findName(),
            release_year: faker.datatype.number({min: -2000, max: 2022}),
            library_id: libraryId // TODO
        })

        librarians.push({
            name: faker.name.findName(),
            age: faker.datatype.number({min: 10, max: 100}),
            library_id: libraryId // TODO
        })
    }
    return { books, librarians }
}

const queryDB = (sql, args) => new Promise((resolve, reject) => {
    dbMysql.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

async function cleanDatabases(){
    console.log('Dropping tables...')

    await dbMysql.query("DROP TABLE IF EXISTS books")
    await dbMysql.query("DROP TABLE IF EXISTS librarians")
    await dbMysql.query("DROP TABLE IF EXISTS libraries")
    
    console.log("Creating tables...")

    await dbMysql.query(`
    CREATE TABLE IF NOT EXISTS libraries(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(200) NOT NULL,
    street VARCHAR(200) NOT NULL,
    PRIMARY KEY (id)
    )`)
    await dbMysql.query(`
        CREATE TABLE IF NOT EXISTS books(
        id INT AUTO_INCREMENT NOT NULL,
        library_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        release_year INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (library_id) REFERENCES libraries(id)
    )`)
    await dbMysql.query(`
        CREATE TABLE IF NOT EXISTS librarians(
        id INT AUTO_INCREMENT NOT NULL,
        library_id INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        age INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (library_id) REFERENCES libraries(id)
    )`)

    console.log('Recreating collections...')
    //NOT WORKING :)
    const booksResult = await dbMongo.collection("books").drop()
    console.log("booksResult:", booksResult)
    if(booksResult){
        dbMongo.createCollection("books")
    }
    const librariansResult = await dbMongo.collection("librarians").drop()
    if(librariansResult){
        dbMongo.createCollection("librarians")
    }
    const librariesResult = await dbMongo.collection("libraries").drop()
    if(librariesResult){
        dbMongo.createCollection("libraries")
    }
    

    return
}

await fakerData(10)