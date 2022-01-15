const res = require("express/lib/response");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const connectionString = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;
const dbName = process.env.MONGO_DB;
client.connect((err, db) => {
    if (err || !db) {
        return res.send(err);
    }
    dbConnection = db.db(dbName);
    console.log("Successfully connected to MongoDB.");
});

module.exports = {
    getDb: () => {
        return dbConnection;
    },
};