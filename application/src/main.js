import express  from 'express';
import { mongoRouter } from './routes/mongo.js'
import { mysqlRouter } from './routes/mysql.js'
var app = express();

app.use("/mongo", mongoRouter)
app.use("/mysql", mysqlRouter)

app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/libraries/mongo');