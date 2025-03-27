const pool = require('../config/database');

const Category = {
    getAll: async () => {
        const { rows } = await pool.query('SELECT * FROM categories ORDER BY id;');
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1;', [id]);
        return rows[0];
    },

    create: async (name, description) => {
        const { rows } = await pool.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *;',
            [name, description]
        );
        return rows[0];
    },

    update: async (id, { name, description }) => {
        const { rows } = await pool.query(`
            UPDATE categories
            SET
                name = COALESCE($1, name),
                description = COALESCE($2, description)
            WHERE id = $3
            RETURNING *;`, [
            name,
            description,
            id
        ]);

        return rows[0];
    },

    delete: async (id) => {
        const { rows } = await pool.query(
            'DELETE FROM categories WHERE id = $1 RETURNING *;',
            [id]
        );
        return rows[0];
    }
};

module.exports = Category;
