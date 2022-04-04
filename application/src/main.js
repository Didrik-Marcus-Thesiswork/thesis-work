// https://graphql.org/graphql-js/running-an-express-graphql-server/

import { schema, bookSchema } from './schema.js'
import { root, rootMysql, rootMongo } from './root-values.js'
import express  from 'express';
import { graphqlHTTP } from 'express-graphql';
import {MongoClient, ObjectId} from 'mongodb';
import mysql from 'mysql'


const homePath = '/graphql'
const URL = 'http://localhost'
const PORT = 4000
const MONGO_URL = 'mongodb://root:root@mongo:27017/admin'

// The root provides a resolver function for each API endpoint


var app = express();

function main(){
  MongoClient.connect(MONGO_URL, function(err, db) {
    if(err){
      console.log("Error occured")
      throw err;
    }else{
      console.log("Connection to Mongo DB established")
    }
    db.close()
  });
}


app.use((req, res, next) => {
  req.mysqlDb= mysql.createConnection({
    host     : 'ms-db',
    port     :  3306, 
    user     : 'root',
    password : 'root',
    database : 'ms-db'
  });
  try {
    req.mysqlDb.connect();
    console.log("Connection to MySQL DB established")
  } catch (err) {
    console.error(err)
  }
  next();
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use('/books', graphqlHTTP ({
  schema: bookSchema,
  rootValue: rootMysql.books,
  graphiql: true
}))

main();

app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql');