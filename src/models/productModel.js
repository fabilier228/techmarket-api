const pool = require('../config/database');

const Product = {
    // Pobiera wszystkie produkty z nazwą kategorii
    getAll: async () => {
        const { rows } = await pool.query(`
            SELECT products.*, categories.name AS category_name 
            FROM products
            JOIN categories ON products.category_id = categories.id
            ORDER BY products.id;
        `);
        return rows;
    },

    // Pobiera produkt po ID, wraz z nazwą kategorii
    getById: async (id) => {
        const { rows } = await pool.query(`
            SELECT products.*, categories.name AS category_name 
            FROM products
            JOIN categories ON products.category_id = categories.id
            WHERE products.id = $1;
        `, [id]);
        return rows[0];
    },

    // Pobiera produkty dla danej kategorii
    getByCategory: async (category_id) => {
        const { rows } = await pool.query(`
            SELECT products.*, categories.name AS category_name 
            FROM products
            JOIN categories ON products.category_id = categories.id
            WHERE category_id = $1
            ORDER BY products.id;
        `, [category_id]);
        return rows;
    },

    // Pobiera recenzje danego produktu wraz z danymi użytkowników
    getReviews: async (product_id) => {
        const { rows } = await pool.query(`
            SELECT reviews.*, users.username 
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            WHERE reviews.product_id = $1
            ORDER BY reviews.created_at DESC;
        `, [product_id]);
        return rows;
    },

    // Tworzy nowy produkt
    create: async (id, name, category_id, description, price, stockCount, brand, imageUrl, isAvailable) => {
        const { rows } = await pool.query(
            `INSERT INTO products (id, name, category_id, description, price, stockCount, brand, imageUrl, isAvailable) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
            [id, name, category_id, description, price, stockCount, brand, imageUrl, isAvailable]
        );
        return rows[0];
    },

    // Aktualizuje istniejący produkt
    update: async (id, { name, category_id, description, price, stockCount, brand, imageUrl, isAvailable }) => {
        const { rows } = await pool.query(`
        UPDATE products
        SET 
            name = COALESCE($1, name),
            category_id = COALESCE($2, category_id),
            description = COALESCE($3, description),
            price = COALESCE($4, price),
            stockCount = COALESCE($5, stockCount),
            brand = COALESCE($6, brand),
            imageUrl = COALESCE($7, imageUrl),
            isAvailable = COALESCE($8, isAvailable)
        WHERE id = $9
        RETURNING *;`, [
            name,
            category_id,
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

    // Usuwa produkt i jego recenzje (jeśli baza ma ON DELETE CASCADE)
    delete: async (id) => {
        const { rows } = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *;',
            [id]
        );
        return rows[0];
    }
};

module.exports = Product;
