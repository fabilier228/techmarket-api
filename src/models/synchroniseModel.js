const {connectToDatabase} = require("../config/mongo");

const COLLECTION = 'products'

const connectToClient = async () => {
    const client = await connectToDatabase();
    return client.db("test-mongo").collection(COLLECTION);
}


module.exports = {
    connectToClient,
}
