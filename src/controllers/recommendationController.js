const {makeRecommendationForUser} = require("../models/recommendationModel")

const makeRecommendation = async (req, res) => {
    try {
        const { userId } = req.params;
        const {recommendedProduct} = await makeRecommendationForUser(parseInt(userId))

        res.status(200).json({message: `Na podstawie twojego przegladania ocenilismy, ze ludzie o podobnych gustach przegladali jeszcze taki produkt`, produktId: recommendedProduct[0]._id})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    makeRecommendation
}