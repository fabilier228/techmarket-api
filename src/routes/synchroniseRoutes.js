const express = require("express");
const {
    synchroniseAvgRatingForProducts,
    synchroniseProductById,
    synchroniseAllProducts
} = require("../controllers/synchroniseController");
const { authenticate, authorize } = require('../middleware/authorizationMiddleware');

const router = express.Router();

router.post("/:productId/sync",authenticate, authorize('admin'), synchroniseProductById)
router.post("/sync", authenticate, authorize('admin'), synchroniseAllProducts);
router.patch("/sync-ratings", authenticate, authorize('admin'), synchroniseAvgRatingForProducts)


module.exports = router;
