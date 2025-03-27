const {v4: uuidv4} = require('uuid');
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')

const getProducts = async (req, res) => {
    const { sortBy, filter } = req.query;

    try {
        let products = await Product.getAll();

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
        console.log("controller", products)
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
    const { name, category_id, description, price, stock_count, brand, image_url, is_available } = req.body;

    try {
        const categoryExists = await Category.getById(category_id);
        if (!categoryExists) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        const newProduct = await Product.create(name, category_id, description, price, stock_count, brand, image_url, is_available);

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

        const currentProductInfo = await Product.getById(id);
        const newProductInfo = Object.assign(currentProductInfo, req.body)

        const updatedProduct = await Product.update(id, newProductInfo);

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

const productsFromCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const products = await Product.getProductsFromCategory(id);
        res.status(200).json(products)
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
    productsFromCategory
};
