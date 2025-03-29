const { MongoClient } = require("mongodb");
const { ServerApiVersion } = require('mongodb');

let client = null;
let dbConnection = null;

async function connectToDatabase() {
    try {
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/test-mongo";

        const options = {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        if (client) {
            return client;
        }

        client = new MongoClient(uri, options);

        await client.connect();

        await client.db("admin").command({ ping: 1 });
        console.log("Pomyślnie połączono z MongoDB! Baza danych jest dostępna.");

        return client;
    } catch (error) {
        console.error("Błąd podczas łączenia z MongoDB:", error);
        client = null;
        throw error;
    }
}

module.exports = { connectToDatabase };