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

const getUserHistoryView = async (userId) => {
    const productViewCollection = await connectToClient();
    const history = await productViewCollection.find({userId: userId})
    return history;
}

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

const getViewStatsOnProducts = async () => {
    const productViewCollection = await connectToClient();
    const stats = await productViewCollection.aggregate([
        {
            $group: {
                _id: "$productId",
                totalViews: { $sum: 1 },
                uniqueUsers: { $addToSet: "$userId" },
                avgDuration: { $avg: "$duration" }
            }
        },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                totalViews: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
                avgDuration: 1
            }
        }
    ]).toArray();

    return stats;
}

const trendViewOverTime = async () => {
    const productViewCollection = await connectToClient();
    const trend = await productViewCollection.aggregate([
        {
            $addFields: { viewDate: { $toDate: "$viewDate" } }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$viewDate" } },
                totalViews: { $sum: 1 },
                uniqueUsers: { $addToSet: "$userId" },
                avgDuration: { $avg: "$duration" }
            }
        },
        {
            $project: {
                _id: 1,
                totalViews: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
                avgDuration: 1
            }
        },
        { $sort: { _id: 1 } }
    ]).toArray();

    return trend;
}

module.exports = {
    getProductView,
    createNewProductView,
    updateProductView,
    deleteProductView,
    getAllProductViews,
    deleteAllProductViews,
    getViewStatsOnProducts,
    trendViewOverTime,
    getUserHistoryView
};