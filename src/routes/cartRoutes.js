const express = require("express");
const {
    addToCart,
    removeFromCart,
    getCart
} = require("../controllers/cartController")
const { authenticate, authorize } = require('../middleware/authorizationMiddleware');


const router = express.Router();

router.post("/add", authenticate, authorize("user"), addToCart);
router.get("/:userId", authenticate, authorize("user"), getCart);
router.delete("/remove", authenticate, authorize("user"), removeFromCart);

module.exports = router;