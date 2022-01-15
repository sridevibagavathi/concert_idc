const res = require("express/lib/response");
const { MongoClient } = require("mongodb");
const connectionString = 'mongodb://localhost:27017';
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;
const dbName = 'concert';
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