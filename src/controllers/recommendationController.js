const {makeRecommendationForUser} = require("../models/recommendationModel")

const makeRecommendation = async (req, res) => {
    try {
        const { userId } = req.query;
        console.log(userId)
        const recommendedProducts = await makeRecommendationForUser(userId)
        console.log(recommendedProducts)

        res.status(200).json({message: `Recommended products for ${userId}`, products: recommendedProducts})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    makeRecommendation
}