import { faker } from '@faker-js/faker';
import { dbMysql, dbMongo } from './db.js'

function fakerData(entries) {

    cleanDatabases()

    // libraries loop
    for(let i = 0; i < entries; i++){

        const results = {}

        const library = {
            name: faker.company.companyName(),
            street: faker.address.city(),
        }

        console.log(`Inserting the following library: `, librarians)
        results.mySQL = await dbMysql.query("INSERT INTO libraries VALUES ?", [library])
        results.mongo = await dbMongo.collection("libraries").insertOne(library)
       
        const { books, librarians } = generatedFakeData(entries)

        console.log('first book',books[0])
        console.log('first librarian', librarians[0])

        console.log(`Inserting the following books into library ${i}: `, books)
        return

        await dbMongo.collection("books").insertMany(books)
        await dbMysql.query("INSERT INTO books (name, release_year, library_id) VALUES ?", [books])

        console.log(`Inserting the following librarians into library ${i}: `, librarians)
        await dbMongo.collection("librarians").insertMany(librarians)
        await dbMysql.query("INSERT INTO librarians (name, age, library_id) VALUES ?", [librarians])
    }

    return 1
}

function generatedFakeData(entries){

    const books = []
    const librarians = []

     // generate fake data for librarians and books
    for(let ii = 0; ii < entries; ii++){

        // create entries in memory
        books.push({
            name: faker.name.findName(),
            release_year: faker.datatype.number({min: -2000, max: 2022}),
            library_id: i // TODO
        })

        librarians.push({
            name: faker.name.findName(),
            age: faker.datatype.number({min: 10, max: 100}),
            library_id: i // TODO
        })
    }
    return { books, librarians }
}

async function cleanDatabases(){
    console.log('dropping tables...')

    await dbMysql.query("DROP TABLE IF EXISTS libraries")
    await dbMysql.query("DROP TABLE IF EXISTS books")
    await dbMysql.query("DROP TABLE IF EXISTS librarians")

    await dbMongo.collection("libraries").drop()
    await dbMongo.collection("books").drop()
    await dbMongo.collection("librarians").drop()


    console.log("recreating tables...")

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

    await dbMongo.createCollection("libraries")
    await dbMongo.createCollection("books")
    await dbMongo.createCollection("librarians")

    return
}

fakerData(10)