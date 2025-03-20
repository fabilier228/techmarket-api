const express = require("express");
const {
    getReviews,
    getReviewById,
    getReviewsByProductId,
    getReviewsByUserId,
    addReview,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/", getReviews);
router.get("/:id", getReviewById);
router.get("/product/:id", getReviewsByProductId);
router.get("/user/:id", getReviewsByUserId);
router.post("/", addReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
