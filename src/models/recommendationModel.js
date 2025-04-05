const { connectToDatabase } = require("../config/mongo");

const COLLECTION = "productViews";

const connectToClient = async () => {
    const client = await connectToDatabase();
    return client.db("test-mongo").collection(COLLECTION);
};

const makeRecommendationForUser = async (userId) => {
    try {
        const productViewsCollection = await connectToClient();

        const userHistory = await productViewsCollection.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: "$productId", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        const mostViewedProduct = userHistory[0]._id;

        const similarUsers = await productViewsCollection.aggregate([
            { $match: { productId: mostViewedProduct, userId: { $ne: userId } } },
            { $group: { _id: "$userId", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();


        const bestMatchingUser = similarUsers[0]._id;
        const recommendedProduct = await productViewsCollection.aggregate([
            { $match: { userId: parseInt(bestMatchingUser), productId: { $ne: parseInt(mostViewedProduct) } } },
            { $group: { _id: "$productId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]).toArray();


        return {
            recommendedProduct: recommendedProduct
        };
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return [];
    }
};


module.exports = {
    makeRecommendationForUser
};
