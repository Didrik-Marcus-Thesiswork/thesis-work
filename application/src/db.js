import {MongoClient, ObjectId} from 'mongodb';
import mysql from 'mysql'

// MongoDB Connection
const mongo_url = 'mongodb://root:root@mongo:27017/admin'
const client = new MongoClient(mongo_url)
const dbName = 'test'

await client.connect()
console.log("connection to MongoDB established")
const dbMongo = client.db(dbName)
const collection = dbMongo.collection("foo")
const foo = await collection.find({}).toArray()
console.log(foo)



/*
MongoClient.connect(mongo_url, function(err, db) {
    if(err){
        console.log("Error occured")
        throw err;
    }else{
        dbMongo = db
        console.log("Connection to Mongo DB established")
    }
});
*/


// MySQL Connection
const dbMysql = mysql.createConnection({
    host     : 'ms-db',
    port     :  3306, 
    user     : 'root',
    password : 'root',
    database : 'ms-db'
});

dbMysql.connect(function (err) {
    if(err){
        console.log("Error occured")
        throw err;
    }else{
        console.log("Connection to MySQL DB established")
    }
})

export { dbMysql, dbMongo }