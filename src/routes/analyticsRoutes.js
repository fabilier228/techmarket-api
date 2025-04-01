const express = require("express");
const { createProductViewSchema } = require("../schemas/productViewSchema")
const { validateRequest } = require("../middleware/validationMiddleware")
const {
    reviewStatsByRating,
    reviewCountDaily,
    viewStatsOnProducts,
    viewTrend
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/review-rating", reviewStatsByRating)
router.get("/review-count", reviewCountDaily);
router.get("/view-stat", viewStatsOnProducts)
router.get("/view-trend", viewTrend)


module.exports = router;
