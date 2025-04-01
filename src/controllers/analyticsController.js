const {
    getReviewStatsByRating, getReviewCountDaily
} = require('../models/reviewModel');

const {
    getViewStatsOnProducts,
    trendViewOverTime
} = require("../models/productViewModel")


const reviewStatsByRating = async (req, res) => {
    try {
        const result = await getReviewStatsByRating()
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({err: err.message})
    }
}

const reviewCountDaily = async (req, res) => {
    try {
        const result = await getReviewCountDaily()
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({err: err.message})
    }
}

const viewStatsOnProducts = async (req, res) => {
    try {
        const result = await getViewStatsOnProducts()
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({err: err.message})
    }
}

const viewTrend = async (req, res) => {
    try {
        const result = await trendViewOverTime()
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({err: err.message})
    }
}

module.exports = {
    reviewStatsByRating,
    reviewCountDaily,
    viewTrend,
    viewStatsOnProducts
}

