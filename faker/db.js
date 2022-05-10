import {MongoClient, ObjectId} from 'mongodb';
import mysql from 'mysql'

// MongoDB Connection
const mongo_url = 'mongodb://root:root@localhost:27017/admin'
const client = new MongoClient(mongo_url)
const dbName = 'test'
client.connect(function(err){
    if(err) console.error("MongoDB error when connecting", err)
    else console.log("connection to MongoDB established")
})

const dbMongo = client.db(dbName)

// MySQL Connection
const dbMysql = mysql.createConnection({
    host     : 'localhost',
    port     :  3306, 
    user     : 'root',
    password : 'root',
    database : 'ms-db'
});

dbMysql.connect(function (err) {
    if(err) console.error("MySQL error when connecting", err)
    else console.log("Connection to MySQL DB established")
})

export { dbMysql, dbMongo }