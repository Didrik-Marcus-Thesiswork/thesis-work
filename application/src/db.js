import {MongoClient, ObjectId} from 'mongodb';
import mysql from 'mysql'

// MongoDB Connection
const MONGO_URL = 'mongodb://root:root@mongo:27017/admin'

var dbMongo = MongoClient.connect(MONGO_URL, function(err, db) {
    if(err){
        console.log("Error occured")
        throw err;
    }else{
        console.log("Connection to Mongo DB established")
    }
});


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