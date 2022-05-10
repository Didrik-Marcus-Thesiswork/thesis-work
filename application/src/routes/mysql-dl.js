import express from 'express';
import { librariesSchema } from '../schema.js'
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { dbMysql } from '../db.js';
import { booksDataLoader, librariansDataLoader } from '../loaders/mysql-loaders.js'

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

    async books(_, context) {
        const rows = await booksDataLoader.load(this.id)
        return rows.map(row => new Book(row))
    }
    async librarians(_, context) {
        const rows = await librariansDataLoader.load(this.id)
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



var mysqlDlRouter = express.Router()

mysqlDlRouter.use('/', graphqlHTTP({
    schema: buildSchema(librariesSchema),
    rootValue: new Query(),
    graphiql: true
}))

export { mysqlDlRouter }