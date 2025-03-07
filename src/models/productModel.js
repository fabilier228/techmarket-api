const pool = require('../config/database');

const Product = {
    getAll: async () => {
        const { rows } = await pool.query('SELECT * FROM products ORDER BY id;');
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1;', [id]);
        return rows[0];
    },

    create: async (id, name, category, description, price, stockCount, brand, imageUrl, isAvailable) => {
        const { rows } = await pool.query(
            'INSERT INTO products (id, name, category, description, price, stockCount, brand, imageUrl, isAvailable) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;',
            [id, name, category, description, price, stockCount, brand, imageUrl, isAvailable]
        );
        return rows[0];
    },

    update: async (id, { name, category, description, price, stockCount, brand, imageUrl, isAvailable }) => {
        const { rows } = await pool.query(`
        UPDATE products
        SET 
            name = COALESCE($1, name),
            category = COALESCE($2, category),
            description = COALESCE($3, description),
            price = COALESCE($4, price),
            stockCount = COALESCE($5, stockCount),
            brand = COALESCE($6, brand),
            imageUrl = COALESCE($7, imageUrl),
            isAvailable = COALESCE($8, isAvailable)
        WHERE id = $9
        RETURNING *;`, [
            name,
            category,
            description,
            price,
            stockCount,
            brand,
            imageUrl,
            isAvailable,
            id
        ]);

        return rows[0];
    },

    delete: async (id) => {
        const { rows } = await pool.query(
            'DELETE FROM products WHERE id = $1',
            [id]
        );
        return rows[0];
    }
};

module.exports = Product;