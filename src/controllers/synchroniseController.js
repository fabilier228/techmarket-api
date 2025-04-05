const Product = require("../models/productModel")
const { connectToClient } = require("../models/synchroniseModel")
const { getReviewStatsByRating } = require("../models/reviewModel")


const synchroniseProductById = async (req, res) => {
    try {
        const {productId} = req.params;
        const client = await connectToClient();
        const mongoProduct = await client.findOne({id: parseInt(productId)})
        console.log(mongoProduct)
        if (mongoProduct) {
            return res.status(400).json({error: "Ten produkt juz zostal zsynchronizowany"})
        }
        const sqlProduct = await Product.getById(productId);
        if (!sqlProduct) {
            return res.status(400).json({error: "Nie ma produktu o takim id"})
        }


        const insertedProduct = await client.insertOne(sqlProduct);

        res.status(200).json({message: `zsynchronizowano produkt o id: ${productId}`, productId: insertedProduct.insertedId})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

const synchroniseAllProducts = async (req, res) => {
    try {
        const client = await connectToClient();
        const sqlProducts = await Product.getAll();
        if (!sqlProducts) {
            return res.status(400).json({error: "Nie ma zadnych produktow w bazie"})
        }

        const insertedProducts = await client.insertMany(sqlProducts);

        res.status(200).json({message: `zsynchronizowano wszystkie produkty`, products: insertedProducts})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

const synchroniseAvgRatingForProducts = async (req, res) => {
    try {
        const data = await getReviewStatsByRating();
        const updateSql = await Product.updateAll("average_rating", data)
        if (updateSql.length === 0) {
            return res.status(400).json({err: "Nie zaktualizowano zadnego rekordu"})
        }

        const updatedProducts = await Product.getAll();

        res.status(200).json({message: "pomyślnie zaktualizowano produkty", products: updatedProducts})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    synchroniseProductById,
    synchroniseAllProducts,
    synchroniseAvgRatingForProducts
}