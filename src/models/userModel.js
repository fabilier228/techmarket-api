const db = require('../config/database');

const User = {
    getAll: async () => {
        try {
            const users = await db
                .select('*')
                .from('users')
                .orderBy('id');
            return users;
        } catch (err) {
            console.error('❌ Błąd podczas pobierania użytkowników:', err);
            throw err;
        }
    },

    // Pobiera użytkownika po ID
    getById: async (id) => {
        try {
            const user = await db
                .select('*')
                .from('users')
                .where('id', id)
                .first();
            return user;
        } catch (err) {
            console.error('❌ Błąd podczas pobierania użytkownika po ID:', err);
            throw err;
        }
    },

    // Tworzy nowego użytkownika
    create: async (username, email, password_hash, first_name, last_name) => {
        try {
            const [newUser] = await db('users')
                .insert({ username, email, password_hash, first_name, last_name })
                .returning('*');
            return newUser;
        } catch (err) {
            console.error('❌ Błąd podczas tworzenia użytkownika:', err);
            throw err;
        }
    },

    // Aktualizuje istniejącego użytkownika
    update: async (id, { username, email, password_hash, first_name, last_name }) => {
        try {
            const [updatedUser] = await db('users')
                .where('id', id)
                .update({ username, email, password_hash, first_name, last_name })
                .returning('*');
            return updatedUser;
        } catch (err) {
            console.error('❌ Błąd podczas aktualizacji użytkownika:', err);
            throw err;
        }
    },

    // Usuwa użytkownika
    delete: async (id) => {
        try {
            const [deletedUser] = await db('users')
                .where('id', id)
                .del()
                .returning('*');
            return deletedUser;
        } catch (err) {
            console.error('❌ Błąd podczas usuwania użytkownika:', err);
            throw err;
        }
    }
};

module.exports = User;
