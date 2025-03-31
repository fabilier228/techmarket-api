const express = require("express");
const { createReviewSchema } = require("../schemas/reviewSchema")
const { validateRequest } = require("../middleware/validationMiddleware")
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
router.post("/",validateRequest(createReviewSchema, 'body')  ,addReview);
router.put("/:reviewId", updateReviewById);
router.delete("/:reviewId", deleteReviewById);


module.exports = router;
