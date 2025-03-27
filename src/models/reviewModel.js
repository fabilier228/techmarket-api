const pool = require('../config/database');

const Review = {
    getAll: async () => {
        const { rows } = await pool.query('SELECT * FROM reviews;');
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM reviews WHERE id = $1;', [id]);
        return rows[0];
    },

    getByProductId: async (product_id) => {
        const { rows } = await pool.query('SELECT * FROM reviews WHERE product_id = $1;', [product_id]);
        return rows;
    },

    getByUserId: async (user_id) => {
        const { rows } = await pool.query('SELECT * FROM reviews WHERE user_id = $1;', [user_id]);
        return rows;
    },

    create: async (product_id, user_id, rating, comment) => {
        const { rows } = await pool.query(
            `INSERT INTO reviews (product_id, user_id, rating, comment) 
             VALUES ($1, $2, $3, $4) RETURNING *;`,
            [product_id, user_id, rating, comment]
        );
        return rows[0];
    },

    update: async (id, { rating, comment }) => {
        const { rows } = await pool.query(`
        UPDATE reviews
        SET 
            rating = COALESCE($1, rating),
            comment = COALESCE($2, comment)
        WHERE id = $3
        RETURNING *;`, [
            rating,
            comment,
            id
        ]);

        return rows[0];
    },

    delete: async (id) => {
        const { rows } = await pool.query(
            'DELETE FROM reviews WHERE id = $1 RETURNING *;',
            [id]
        );
        return rows[0];
    }
};

module.exports = Review;
