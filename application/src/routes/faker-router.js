import express from 'express';
import faker from '@faker-js/faker'
import { dbMongo } from '../db.js'

const fakerRouter = express.Router()

/**
 * Creates a single library and inserts given amounts of entries for both books and librarians
 */

fakerRouter.use('/mongo/:entries', async function(req, res){
    
    const { entries } = req.params // amount of fake entries
    
    const library = {
        name: faker.company.companyName(),
        street: faker.address.city(),
    }

    const results = dbMongo.collection("libraries").insertOne(library)

    console.log(results)

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
    
    // insert all entries
    dbMongo.collection("books").insertMany(books)
    dbMongo.collection("librarians").insertMany(librarians)
})

fakerRouter.use('/mysql/:entries', async function(req, res){
    
})

export { fakerRouter }