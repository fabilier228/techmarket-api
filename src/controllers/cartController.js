const { connectToDatabase } = require("../config/mongo");
const cartSchema = require("../models/cart");


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

        const insertResult = await cartCollection.insertOne(result)

        res.status(200).json({ message: "Produkt dodany do koszyka", cartId: insertResult.insertedId});
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera" });
    }
};

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const client = await connectToDatabase();
        const cartCollection = await client.db("test-mongo").collection("carts");

        const cart = await cartCollection.findOne({ userId });
        console.log(cart)

        res.status(200).json(cart || { userId, items: [] });
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera" });
    }
};

const updateQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Walidacja danych
        const { isValid, errors } = cartSchema.validateCartItem({ userId, productId, quantity });
        if (!isValid) {
            return res.status(400).json({ errors });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: "Ilość musi być większa od 0" });
        }

        const cartCollection = await getCartCollection();
        const result = await cartCollection.updateOne(
            { userId, "items.productId": productId },
            { $set: { "items.$.quantity": quantity } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Produkt nie znaleziony w koszyku" });
        }

        res.status(200).json({ message: "Ilość produktu zaktualizowana" });
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Walidacja danych
        const { isValid, errors } = cartSchema.validateCartItem({ userId, productId });
        if (!isValid) {
            return res.status(400).json({ errors });
        }

        const cartCollection = await getCartCollection();

        const result = await cartCollection.updateOne(
            { userId },
            { $pull: { items: { productId } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Produkt nie znaleziony w koszyku" });
        }

        res.status(200).json({ message: "Produkt usunięty z koszyka" });
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera" });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart
};
