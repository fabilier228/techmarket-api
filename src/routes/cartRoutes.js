const express = require("express");
const {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart
} = require("../controllers/cartController")

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.put("/update", updateQuantity);
router.delete("/remove", removeFromCart);

module.exports = router;