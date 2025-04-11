const express = require("express");
const {
    addToCart,
    removeFromCart,
    getCart
} = require("../controllers/cartController")
const { authenticate } = require('../middleware/authorizationMiddleware');


const router = express.Router();

router.post("/add", authenticate, addToCart);
router.get("/", authenticate, getCart);
router.delete("/remove", authenticate, removeFromCart);

module.exports = router;