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

module.exports = {
    getReview,
    createNewReview,
    updateReview,
    deleteReview,
    getReviewsWithFilters,
    getAll
}