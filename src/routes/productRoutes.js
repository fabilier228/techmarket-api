const express = require("express");
const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductReviews
} = require("../controllers/productController");

const router = express.Router();


router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get('/category/:id/products', getProductsByCategory);
router.get('/reviews/product/:id', getProductReviews);


module.exports = router;
