import express  from 'express';
import { librariesSchema } from '../schema.js'
import { rootMysql } from '../root/mysql-root.js'
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { dbMysql} from '../db.js';
import { groupBy, map } from 'ramda';

class Query {
    async libraries(args, context) {
        const rows = await queryDB("select * from libraries limit ?", [args.limit]).then(data => data)
        if (!rows.length) throw Error("Error") 
        return rows.map(row => new Library(row))
    }
    async library(args, context) {
        const row = await queryDB("select * from libraries where id = ?", [args.id]).then(data => data)
        if (!row.length) throw Error("Error")
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
      const rows = queryDB("select * from books where library_id = ?", this.id).then(data => data)
      console.log("books", rows)
      return rows;
    }
    async librarians(_, context) {
        const rows = queryDB("select * from librarians where library_id = ?", this.id).then(data => data)
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

const queryDB = (sql, args) => new Promise((resolve, reject) => {
    dbMysql.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

var mysqlRouter = express.Router()

mysqlRouter.use('/', graphqlHTTP ({
    schema: buildSchema(librariesSchema),
    rootValue: new Query(),
    graphiql: true
}))

export { mysqlRouter }