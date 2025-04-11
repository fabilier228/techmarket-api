const express = require("express");
const {
    synchroniseAvgRatingForProducts,
    synchroniseProductById,
    synchroniseAllProducts
} = require("../controllers/synchroniseController");
const { authenticate, authorize } = require('../middleware/authorizationMiddleware');

const router = express.Router();

router.post("/:productId/sync",authenticate, synchroniseProductById)
router.post("/sync", authenticate, synchroniseAllProducts);
router.patch("/sync-ratings", authenticate, synchroniseAvgRatingForProducts)


module.exports = router;
