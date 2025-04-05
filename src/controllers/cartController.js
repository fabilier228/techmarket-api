const { connectToDatabase } = require("../config/mongo");
const cartSchema = require("../schemas/cartSchema");
const {makeRecommendationForUser} = require("../models/recommendationModel")
const Product = require("../models/productModel")


const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const { isValid, errors } = cartSchema.validateCartItem({ userId, productId, quantity });
        if (!isValid) {
            return res.status(400).json({error: "Niepoprawne dane" });
        }

        const client = await connectToDatabase();
        const cartCollection = await client.db("test-mongo").collection("carts");

        const result = {
            userId: userId,
            productId: productId,
            quantity: quantity,
            dateAdded: new Date()
        }

        let existingItem = await cartCollection.findOne({ userId, productId });
        let cartId

        if (existingItem) {
            await cartCollection.updateOne(
                { _id: existingItem._id },
                { $inc: { quantity: quantity }, $set: { dateAdded: new Date() } }
            );
            cartId = existingItem._id
        } else {
            const insertResult = await cartCollection.insertOne(result);
            cartId = insertResult.insertedId
        }

        res.status(200).json({ message: "Produkt dodany do koszyka", cartId: cartId});
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera" });
    }
};

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const client = await connectToDatabase();
        const cartCollection = await client.db("test-mongo").collection("carts");

        const recommendationFromAnotherUser = makeRecommendationForUser(parseInt(userId))

        const cart = await cartCollection.find({userId: parseInt(userId)}).toArray();

        if (cart.length === 0) {
            return res.status(404).json({ error: "Koszyk jest pusty lub nie istnieje" });
        }

        const newCart = cart.reduce((acc, item) => {
            acc.items.push({ productId: item.productId, quantity: item.quantity });
            return acc;
        }, {
            id: cart[0]._id,
            userId: cart[0].userId,
            items: []
        });
        const similarProductsPromises = newCart.items.map(async (product) => {
            console.log(product)
            const similar = await Product.findSimilarProduct(product.productId)
            return similar
        })

        const similarProducts = await Promise.all(similarProductsPromises);





        res.status(200).json({cart: newCart,
                        recommendation: recommendationFromAnotherUser,
                        similarProducts:similarProducts} || { userId, items: [] });
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const client = await connectToDatabase();
        const cartCollection = await client.db("test-mongo").collection("carts");

        const productInCart = await cartCollection.findOne({
            userId: parseInt(userId),
            productId: parseInt(productId)
        });
        console.log(productInCart)

        if (!productInCart) {
            return res.status(404).json({ error: "Produkt nie znaleziony w koszyku" });
        }

        if (productInCart.quantity <= 1) {
            await cartCollection.deleteOne({
                userId: parseInt(userId),
                productId: parseInt(productId)
            });

        } else {
            await cartCollection.updateOne(
                { _id: productInCart._id },
                {
                    $inc: { quantity: -1 },
                    $set: { dateAdded: new Date() }
                }
            );
            res.status(200).json({ message: "Ilość produktu zaktualizowana" });
            return
        }

        res.status(200).json({ message: "Produkt usunięty z koszyka" });
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera" });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getCart
};
