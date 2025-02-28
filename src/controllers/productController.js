const products = require("../data/products");

const getProducts = (req, res) => {
    res.json(products);
};

const getProductById = (req, res) => {
    const id = req.params.id
    const product = products.find(prod => prod.id === parseInt(id))

    if (!product) return res.status(404).json({message: `product with ${id} does not exist`})
    return res.json(product)
}

const addProduct = (req, res) => {
    const { name, category, description, price, stockCount, brand, imageUrl, isAvailable } = req.body;

    const newProduct = {
        id: products.length + 1,
        name,
        category,
        description: description || "",
        price,
        stockCount: stockCount !== undefined ? stockCount : 0,
        brand,
        imageUrl: imageUrl || "",
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        createdAt: new Date().toISOString()
    };

    products.push(newProduct)
    res.status(201).json(newProduct)
};


const updateProduct = (req, res) => {
    const product = products.find((p) => p.id === parseInt(req.params.id));

    if (!product) {
        return res.status(404).json({ message: "Produkt nie znaleziony" });
    }

    Object.assign(product, req.body);

    res.json(product);
};

const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id)
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ message: "Produkt nie znaleziony" });
    }

    products.splice(productIndex, 1);
    res.json({ message: "Produkt usunięty" });
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
