const db = require('../config/database'); // Połączenie z bazą danych za pomocą Knex.js

const Category = {
    // Pobiera wszystkie kategorie
    getAll: async () => {
        try {
            const categories = await db
                .select('*') // Pobiera wszystkie kolumny z tabeli categories
                .from('categories')
                .orderBy('id'); // Sortowanie po id rosnąco
            return categories;
        } catch (err) {
            console.error('❌ Błąd podczas pobierania kategorii:', err);
            throw err;
        }
    },

    // Pobiera kategorię po ID
    getById: async (id) => {
        try {
            const category = await db
                .select('*') // Pobiera wszystkie kolumny z tabeli categories
                .from('categories')
                .where('id', id) // Filtruje kategorię po id
                .first(); // Zwraca tylko pierwszy wynik (jedną kategorię)
            return category;
        } catch (err) {
            console.error('❌ Błąd podczas pobierania kategorii:', err);
            throw err;
        }
    },

    // Tworzy nową kategorię
    create: async (name, description) => {
        try {
            const [newCategory] = await db('categories')
                .insert({ name, description })
                .returning('*'); // Zwraca pełny obiekt nowo utworzonej kategorii
            return newCategory;
        } catch (err) {
            console.error('❌ Błąd podczas tworzenia kategorii:', err);
            throw err;
        }
    },

    // Aktualizuje istniejącą kategorię
    update: async (id, { name, description }) => {
        try {
            const [updatedCategory] = await db('categories')
                .where('id', id) // Filtruje po ID
                .update({ name, description }) // Aktualizuje wartości
                .returning('*'); // Zwraca pełny obiekt zaktualizowanej kategorii
            return updatedCategory;
        } catch (err) {
            console.error('❌ Błąd podczas aktualizacji kategorii:', err);
            throw err;
        }
    },

    // Usuwa kategorię
    delete: async (id) => {
        try {
            const [deletedCategory] = await db('categories')
                .where('id', id) // Filtruje po ID
                .del() // Usuwa kategorię
                .returning('*'); // Zwraca pełny obiekt usuniętej kategorii
            return deletedCategory;
        } catch (err) {
            console.error('❌ Błąd podczas usuwania kategorii:', err);
            throw err;
        }
    }
};

module.exports = Category;
