const { ObjectId } = require("mongodb");

const {
    updateReview,
    getReviewsWithFilters,
    deleteReview,
    createNewReview,
    getReview, getAll
} = require('../models/reviewModel');


const addReview = async (req, res) => {
    try {
        const reviewData = req.body;
        const reviewId = await createNewReview(reviewData);

        if (!reviewId) {
            return res.status(400).json({error: "Nie udało się dodać recenzji"})
        }

        res.status(200).json({message: `Dodano recenzje, id: ${reviewId}`})
    } catch (err) {
        res.status(500).json({ error: "Błąd serwera" });
    }

}

const getAllReviews = async (req, res) => {
    try {
        const reviews = await getAll();
        if (!reviews) {
            return res.status(400).json({error: "Nie ma żadnych recenzji"})
        }
        res.status(200).json(reviews)
    } catch (err) {
        res.status(500).json({ error: "Błąd serwera" });
    }
}

const getProductReviewsWithFilters = async (req, res) => {
    try {
        const { productId } = req.params;
        const { query, rating, verifiedPurchase, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

        const searchFilters = { productId: parseInt(productId) };

        if (query) {
            searchFilters.$or = [
                { title: { $regex: query, $options: "i" } },
                { content: { $regex: query, $options: "i" } }
            ];
        }

        if (rating) {
            searchFilters.rating = parseInt(rating);
        }

        if (verifiedPurchase !== undefined) {
            searchFilters.verifiedPurchase = verifiedPurchase === 'true';
        }

        const reviews = await getReviewsWithFilters(searchFilters, { sortBy, order, page, limit });

        if (!reviews || reviews.totalReviews === 0) {
            return res.status(404).json({ error: "Brak recenzji spełniających kryteria wyszukiwania", productId });
        }

        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd serwera" });
    }
};


const updateReviewById = async (req, res) => {
    try {
        const newReviewData = req.body;
        let {reviewId} = req.params;
        reviewId = new ObjectId(reviewId)
        const existingReview = await getReview(reviewId)

        if (!existingReview) {
            return res.status(400).json({error: "Nie ma recenzji o tym id"})
        }

        const result = await updateReview(reviewId, newReviewData)

        if (result.matchedCount === 0) {
            return res.status(400).json({error: 'Nie udało się zaktualizować recenzji'})
        }

        const updatedReview = await getReview(reviewId);

        res.status(200).json(updatedReview)
    } catch (err) {
        throw new Error(`Błąd aktualizacji recenzji: ${err.message}`);
    }
}


const deleteReviewById = async (req,res) => {
    try {
        let {reviewId} = req.params;
        reviewId = new ObjectId(reviewId)

        const result = await deleteReview(reviewId);

        if (result.deletedCount === 0 ) {
            return res.status(400).json({error: "Nie udalo sie usunac "})
        }

        res.status(200).json({message: `Pomyslnie usunieto review o id: ${reviewId}`})
    } catch (err) {
        res.status(500).json({error: "Błąd serwera"})
    }
}




module.exports = {
    addReview,
    getProductReviewsWithFilters,
    updateReviewById,
    deleteReviewById,
    getAllReviews,
}

