const { connectToDatabase } = require("../config/mongo");

const COLLECTION = 'reviews'

const connectToClient = async () => {
    const client = await connectToDatabase();
    return client.db("test-mongo").collection(COLLECTION);
}

const getReview = async (reviewId) => {
    const reviewCollection = await connectToClient();
    const result = await reviewCollection.findOne({_id: reviewId})
    return result;
}

const getAll = async () => {
    const reviewCollection = await connectToClient();
    const result = await reviewCollection.find({}).toArray();
    return result
}

const createNewReview = async (reviewData) => {
    const reviewCollection = await connectToClient();

    const result = await reviewCollection.insertOne(reviewData);

    return result.insertedId;
}

const getReviewsWithFilters = async (filters, { sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 }) => {
    const reviewCollection = await connectToClient();

    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    const reviews = await reviewCollection.find(filters)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

    const totalReviews = await reviewCollection.countDocuments(filters);

    return {
        reviews,
        totalReviews,
        totalPages: Math.ceil(totalReviews / limit),
        currentPage: page
    };
};


const updateReview = async (reviewId, newReviewData) => {
    const reviewCollection = await connectToClient();

    const result = await reviewCollection.updateOne(
        { _id: reviewId }, // Warunek wyszukiwania recenzji po ID
        { $set: newReviewData } // Zaktualizowanie danych recenzji
    );

    return result;
}

const deleteReview = async (reviewId) => {
    const reviewCollection = await connectToClient();

    const result = await reviewCollection.deleteOne({_id: reviewId})

    return result;
}

const deleteAllReviews = async () => {
    const reviewCollection = await connectToClient()
    await reviewCollection.deleteMany({})
}

const getReviewStatsByRating = async () => {
    const reviewCollection = await connectToClient()
    const stats = await reviewCollection.aggregate([
        {
            $group: {
                _id: "$productId",
                count: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                count: 1,
                avgRating: 1
            }
        }
    ]).toArray();

    return stats
}

const getReviewCountDaily = async () => {
    const reviewCollection = await connectToClient()
    const trend = await reviewCollection.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$reviewDate" } },
                totalReviews: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]).toArray();

    return trend
}

module.exports = {
    getReview,
    createNewReview,
    updateReview,
    deleteReview,
    getReviewsWithFilters,
    getAll,
    deleteAllReviews,
    getReviewStatsByRating,
    getReviewCountDaily
}