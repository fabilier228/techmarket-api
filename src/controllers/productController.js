const { v4: uuidv4 } = require('uuid');
const db = require("../config/database.js");

const getProducts = (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
};

const getProductById = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: `Product with ID ${id} not found` });
            return;
        }
        res.json(row);
    });
}

const addProduct = (req, res) => {
    const { name, category, description, price, stockCount, brand, imageUrl, isAvailable } = req.body;
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    db.run(
        `INSERT INTO products (id, name, category, description, price, stockCount, brand, imageUrl, isAvailable, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, category, description || "", price, stockCount || 0, brand, imageUrl || "", isAvailable ? 1 : 0, createdAt],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id, name, category, description, price, stockCount, brand, imageUrl, isAvailable, createdAt });
        }
    );
};


const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, category, description, price, stockCount, brand, imageUrl, isAvailable } = req.body;

    db.run(
        `UPDATE products SET 
            name = ?, 
            category = ?, 
            description = ?, 
            price = ?, 
            stockCount = ?, 
            brand = ?, 
            imageUrl = ?, 
            isAvailable = ? 
         WHERE id = ?`,
        [name, category, description, price, stockCount, brand, imageUrl, isAvailable ? 1 : 0, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: `Product with ID ${id} not found` });
                return;
            }
            res.json({ id, name, category, description, price, stockCount, brand, imageUrl, isAvailable });
        }
    );
};

const deleteProduct = (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: `Product with ID ${id} not found` });
            return;
        }
        res.json({ message: "Product deleted successfully" });
    });
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
