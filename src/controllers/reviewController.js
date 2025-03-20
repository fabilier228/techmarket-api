const { v4: uuidv4 } = require('uuid');
const Review = require('../models/reviewModel');

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.getAll();
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getReviewById = async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.getById(id);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getReviewsByProductId = async (req, res) => {
    const { productId } = req.params;
    try {
        const reviews = await Review.getByProductId(productId);
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getReviewsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const reviews = await Review.getByUserId(userId);
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addReview = async (req, res) => {
    const { productId, userId, rating, comment } = req.body;
    const id = uuidv4();

    try {
        const newReview = await Review.create(id, productId, userId, rating, comment);
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    try {
        const updatedReview = await Review.update(id, { rating, comment });

        if (!updatedReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReview = await Review.delete(id);
        if (!deletedReview) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.status(200).json({ message: `Deleted review: ${id}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getReviews,
    getReviewById,
    getReviewsByProductId,
    getReviewsByUserId,
    addReview,
    updateReview,
    deleteReview
};
