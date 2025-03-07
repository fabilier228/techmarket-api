const {v4: uuidv4} = require('uuid');
const Product = require('../models/productModel')

const getProducts = async (req, res) => {
    const { sortBy, filter } = req.query;

    try {
        let products = await Product.getAll();

        products = products.map(product => ({
            ...product,
            isAvailable: product.isavailable,
            stockCount: product.stockcount,
            imageUrl: product.imageurl
        }));

        if (filter) {
            const isAvailable = filter === 'true';
            products = products.filter(product => product.isAvailable === isAvailable);
        }

        if (sortBy) {
            products = products.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return -1;
                if (a[sortBy] > b[sortBy]) return 1;
                return 0;
            });
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.getById(id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const addProduct = async (req, res) => {
    const {name, category, description, price, stockCount, brand, imageUrl, isAvailable} = req.body;
    const id = uuidv4();

    try {
        const newProduct = await Product.create(id, name, category, description, price, stockCount, brand, imageUrl, isAvailable);
        res.status(200).json(newProduct)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};


const updateProduct = async (req, res) => {
    const { id } = req.params; // Extract the product ID from the URL
    const { name, category, description, price, stockCount, brand, imageUrl, isAvailable } = req.body;

    try {
        const updatedProduct = await Product.update(id, {
            name,
            category,
            description,
            price,
            stockCount,
            brand,
            imageUrl,
            isAvailable
        });

        res.status(201).json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.delete(id)
        res.status(200).json({message: "deleted product: " + id})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
