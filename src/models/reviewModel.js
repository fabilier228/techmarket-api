const db = require('../config/database');

const Review = {
    getAll: async () => {
        try {
            const reviews = await db
                .select('*')
                .from('reviews');
            return reviews;
        } catch (err) {
            console.error('❌ Błąd podczas pobierania recenzji:', err);
            throw err;
        }
    },

    // Pobiera recenzję po ID
    getById: async (id) => {
        try {
            const review = await db
                .select('*')
                .from('reviews')
                .where('id', id)
                .first();
            return review;
        } catch (err) {
            console.error('❌ Błąd podczas pobierania recenzji po ID:', err);
            throw err;
        }
    },

    getByProductId: async (product_id) => {
        try {
            const reviews = await db
                .select('*')
                .from('reviews')
                .where('product_id', product_id);
            return reviews;
        } catch (err) {
            console.error('❌ Błąd podczas pobierania recenzji po product_id:', err);
            throw err;
        }
    },

    // Pobiera recenzje po ID użytkownika
    getByUserId: async (user_id) => {
        try {
            const reviews = await db
                .select('*')
                .from('reviews')
                .where('user_id', user_id);
            return reviews;
        } catch (err) {
            console.error('❌ Błąd podczas pobierania recenzji po user_id:', err);
            throw err;
        }
    },

    // Tworzy nową recenzję
    create: async (product_id, user_id, rating, comment) => {
        try {
            const { rows } = await db.raw(`
                INSERT INTO reviews (product_id, user_id, rating, comment)
                VALUES (?, ?, ?, ?)
                RETURNING *;
            `, [product_id, user_id, rating, comment]);

            return rows[0]; // Zwraca pełny obiekt nowo utworzonej recenzji
        } catch (err) {
            console.error('❌ Błąd podczas tworzenia recenzji:', err);
            throw err;
        }
    },

    // Aktualizuje istniejącą recenzję
    update: async (id, { rating, comment }) => {
        try {
            const [updatedReview] = await db('reviews')
                .where('id', id)
                .update({ rating, comment })
                .returning('*');
            return updatedReview;
        } catch (err) {
            console.error('❌ Błąd podczas aktualizacji recenzji:', err);
            throw err;
        }
    },

    // Usuwa recenzję
    delete: async (id) => {
        try {
            const [deletedReview] = await db('reviews')
                .where('id', id)
                .del() // Usuwa recenzję
                .returning('*');
            return deletedReview;
        } catch (err) {
            console.error('❌ Błąd podczas usuwania recenzji:', err);
            throw err;
        }
    }
};

module.exports = Review;
