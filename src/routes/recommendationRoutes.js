const express = require("express");
const {
    makeRecommendation
} = require("../controllers/recommendationController");

const router = express.Router();

router.get("/:userId", makeRecommendation)


module.exports = router;
