import express from 'express';
import { librariesSchema } from '../schema.js'
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { dbMongo } from '../db.js';

class Query {
    async libraries(args, context) {
        var rows
        if (args.limit) rows = await dbMongo.collection("libraries").find().limit(args.limit).toArray()
        else rows = await dbMongo.collection("libraries").find().toArray()
        if (!rows.length) throw Error("Error: No libraries found")
        return rows.map(row => new Library(row))
    }
    async library(args, context) {
        const row = await dbMongo.collection("libraries").find({ id: args.id }).toArray()
        if (!row.length) throw Error("Error: No library ID specified")
        return new Library(row[0])
    }
}

class Library {
    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.street = row.street;
        this._books = row.books;
        this._librarians = row.librarians;
    }

    async books(args, context) {
        const rows = dbMongo.collection("books").find({ library_id: this.id }).toArray()
        return rows;
    }
    async librarians(args, context) {
        const rows = dbMongo.collection("librarians").find({ library_id: this.id }).toArray()
        return rows;
    }
}

class Book {
    constructor(row) {
        this.title = row.title;
        this.release_year = row.release_year;
        this.library_id = row.library_id;
    }
}

class Librarian {
    constructor(row) {
        this.name = row.name;
        this.release_year = row.release_year;
        this.library_id = row.library_id;
    }
}

var mongoRouter = express.Router()

mongoRouter.use('/', graphqlHTTP({
    schema: buildSchema(librariesSchema),
    rootValue: new Query(),
    graphiql: true
}))

export { mongoRouter }