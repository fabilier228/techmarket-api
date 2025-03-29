const express = require("express");
const {
    addReview,
    getProductReviewsWithFilters,
    deleteReviewById,
    updateReviewById,
    getAllReviews,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/", getAllReviews)
router.get("/product/:productId", getProductReviewsWithFilters);
router.post("/", addReview);
router.put("/:reviewId", updateReviewById);
router.delete("/:reviewId", deleteReviewById);


module.exports = router;
