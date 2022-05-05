import { faker } from '@faker-js/faker';
import { SingleFieldSubscriptionsRule } from 'graphql';
import { dbMysql, dbMongo } from './db.js'


/**
 * Creates a single library and inserts a given amount of entries for both books and librarians
 */
async function insertMongo(entries){
    
    console.log(`
    Inserting data into Mongo...
    One library will be created which will have ${entries} amount of books and librarians.
    `)

    const library = {
        name: faker.company.companyName(),
        street: faker.address.city(),
    }

    console.log("- inserting one library...", library)
    const results = await dbMongo.collection("libraries").insertOne(library)

    console.log('- done')

    console.log("- generating fake data for books and librarians...")

    const {books, librarians } = fakerData(entries)
    
    console.log("- done")
    console.log("- inserting fake data for books and librarians...")
    
    // insert all entries
    await dbMongo.collection("books").insertMany(books)
    await dbMongo.collection("librarians").insertMany(librarians)

    console.log("- done with Mongo")

    return 1
}

async function insertMySQL(entries){
    
    console.log(`
    Inserting data into MySQL...
    One library will be created which will have ${entries} amount of books and librarians.
    `)

    const library = {
        name: faker.company.companyName(),
        street: faker.address.city(),
    }

    console.log("- inserting one library...")
    const results = await dbMysql.query("INSERT INTO libraries VALUES ?", [library])

    console.log('- done')

    console.log("- generating fake data for books and librarians...")

    const books = []
    const librarians = []

    for(let i = 0; i < entries; i++){

        // create entries in memory
        books.push([
            ['name', faker.name.findName()],
            ['release_year', faker.datatype.number({min: -2000, max: 2022})],
            ['library_id', -1] // TODO
        ])

        librarians.push([
            ['name', faker.name.findName()],
            ['age', faker.datatype.number({min: 10, max: 100})],
            ['library_id', -1] // TODO
        ])
    }
    
    console.log("- %cdone", "color:green")
    console.log("- inserting fake data for books and librarians...")
    
    // insert all entries
    await dbMysql.query("INSERT INTO books (name, release_year, library_id) VALUES ?", [books])
    await dbMysql.query("INSERT INTO librarians (name, age, library_id) VALUES ?", [librarians])

    console.log("done with MySQL")

    return 1
}

function fakerData(entries) {

    const books = []
    const librarians = []

    for(let i = 0; i < entries; i++){

        // create entries in memory
        books.push({
            name: faker.name.findName(),
            release_year: faker.datatype.number({min: -2000, max: 2022}),
            library_id: -1 // TODO
        })

        librarians.push({
            name: faker.name.findName(),
            age: faker.datatype.number({min: 10, max: 100}),
            library_id: -1 // TODO
        })
    }
    return {books, librarians}
}
console.log("waiting 10 sec for db connections...")
setTimeout (async function(){

    await insertMongo(2)
    // await insertMySQL(2) // TODO
}, 10000)

export{insertMongo, insertMySQL}