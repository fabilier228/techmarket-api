const { connectToDatabase } = require("../config/mongo");

const COLLECTION = 'productViews'

const connectToClient = async () => {
    const client = await connectToDatabase();
    return client.db("test-mongo").collection(COLLECTION);
}

const getProductView = async (viewId) => {
    const productViewCollection = await connectToClient();
    const result = await productViewCollection.findOne({ _id: viewId });
    return result;
};

const getAllProductViews = async () => {
    const productViewCollection = await connectToClient();
    return await productViewCollection.find({}).toArray();
};

const createNewProductView = async (viewData) => {
    const productViewCollection = await connectToClient();
    const result = await productViewCollection.insertOne(viewData);
    return result.insertedId;
};

const updateProductView = async (viewId, newViewData) => {
    const productViewCollection = await connectToClient();
    const result = await productViewCollection.updateOne(
        { _id: viewId },
        { $set: newViewData }
    );
    return result;
};

const deleteProductView = async (viewId) => {
    const productViewCollection = await connectToClient();
    return await productViewCollection.deleteOne({ _id: viewId });
};

const deleteAllProductViews = async () => {
    const productViewCollection = await connectToClient();
    await productViewCollection.deleteMany({})
}

module.exports = {
    getProductView,
    createNewProductView,
    updateProductView,
    deleteProductView,
    getAllProductViews,
    deleteAllProductViews
};