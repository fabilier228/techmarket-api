const pool = require('../config/database');

const User = {
    getAll: async () => {
        const { rows } = await pool.query('SELECT * FROM users ORDER BY id;');
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
        return rows[0];
    },

    create: async (username, email, password_hash, first_name, last_name) => {
        const { rows } = await pool.query(
            `INSERT INTO users (username, email, password_hash, first_name, last_name) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
            [username, email, password_hash, first_name, last_name]
        );
        return rows[0];
    },

    update: async (id, { username, email, password_hash, first_name, last_name }) => {
        const { rows } = await pool.query(`
        UPDATE users
        SET 
            username = COALESCE($1, username),
            email = COALESCE($2, email),
            password_hash = COALESCE($3, password_hash),
            first_name = COALESCE($4, first_name),
            last_name = COALESCE($5, last_name)
        WHERE id = $6
        RETURNING *;`, [
            username,
            email,
            password_hash,
            first_name,
            last_name,
            id
        ]);

        return rows[0];
    },

    delete: async (id) => {
        const { rows } = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *;',
            [id]
        );
        return rows[0];
    }
};

module.exports = User;
