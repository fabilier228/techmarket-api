const {v4: uuidv4} = require('uuid');
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')

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
    const { name, category_id, description, price, stockCount, brand, imageUrl, isAvailable } = req.body;

    try {
        const categoryExists = await Category.getById(category_id);
        if (!categoryExists) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        const newProduct = await Product.create(name, category_id, description, price, stockCount, brand, imageUrl, isAvailable);

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category_id, description, price, stockCount, brand, imageUrl, isAvailable } = req.body;

    try {
        if (category_id) {
            const categoryExists = await Category.getById(category_id);
            if (!categoryExists) {
                return res.status(400).json({ error: 'Invalid category ID' });
            }
        }

        const updatedProduct = await Product.update(id, {
            name,
            category_id,
            description,
            price,
            stockCount,
            brand,
            imageUrl,
            isAvailable
        });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
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


const getProductsByCategory = async (req, res) => {
    const { category_id } = req.params;

    try {
        const foundProducts = await Product.getByCategory(category_id)
        res.status(200).json(foundProducts)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

const getProductReviews = async (req, res) => {
    const { product_id } = req.params;

    try {
        const reviews = await Product.getReviews(product_id)
        res.status(200).json(reviews)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductReviews
};
