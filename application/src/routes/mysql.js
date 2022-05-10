import express from 'express';
import { librariesSchema } from '../schema.js'
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { dbMysql } from '../db.js';

class Query {
    async libraries(args, context) {
        var query = "select * from libraries"
        if (args.limit) query += " limit ?"
        const rows = await queryDB(query, [args.limit]).then(data => data)
        if (!rows.length) throw Error("Error: No libraries found")
        return rows.map(row => new Library(row))
    }
    async library(args, context) {
        var query = "select * from libraries where id = ?"
        const row = await queryDB(query, [args.id]).then(data => data)
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
        var query = "select * from books where library_id = ?"
        if (args.limit) query += " limit ?"
        const rows = await queryDB(query, [this.id, args.limit]).then(data => data)
        return rows.map(row => new Book(row))
    }
    async librarians(args, context) {
        var query = "select * from librarians where library_id = ?"
        if (args.limit) query += " limit ?"
        const rows = await queryDB(query, [this.id, args.limit]).then(data => data)
        return rows.map(row => new Librarian(row))
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

const queryDB = (sql, args) => new Promise((resolve, reject) => {
    dbMysql.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

var mysqlRouter = express.Router()

mysqlRouter.use('/', graphqlHTTP({
    schema: buildSchema(librariesSchema),
    rootValue: new Query(),
    graphiql: true
}))

export { mysqlRouter }