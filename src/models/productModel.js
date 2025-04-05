const db = require('../config/database'); // Połączenie do bazy danych z Knex.js

const Product = {
    // Pobiera wszystkie produkty z nazwą kategorii
    getAll: async () => {
        try {
            const products = await db
                .select('products.*', 'categories.name AS category_name')
                .from('products')
                .join('categories', 'products.category_id', 'categories.id')
                .orderBy('products.id'); // Sortuje według ID produktu

            return products;
        } catch (err) {
            console.error('❌ Błąd podczas pobierania produktów:', err);
            throw err;
        }
    },

    // Pobiera produkt po ID, wraz z nazwą kategorii
    getById: async (id) => {
        try {
            const product = await db
                .select('products.*', 'categories.name AS category_name')
                .from('products')
                .join('categories', 'products.category_id', 'categories.id')
                .where('products.id', id)
                .first(); // Zwraca tylko jeden wynik
            return product;
        } catch (err) {
            console.error('❌ Błąd podczas pobierania produktu:', err);
            throw err;
        }
    },

    // Tworzy nowy produkt
    create: async (name, category_id, description, price, stock_count, brand, image_url, is_available) => {
        try {
            const { rows } = await db.raw(`
            INSERT INTO products (name, category_id, description, price, stock_count, brand, image_url, is_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *;
        `, [name, category_id, description, price, stock_count, brand, image_url, is_available]);

            return rows[0]; // Zwraca pełny obiekt nowo utworzonego produktu
        } catch (err) {
            console.error('❌ Błąd podczas tworzenia produktu:', err);
            throw err;
        }
    },

    // Aktualizuje produkt
    update: async (id, { name, category_id, description, price, stock_count, brand, image_url, is_available }) => {
        try {
            const { rows } = await db.raw(`
            UPDATE products
            SET name = ?, category_id = ?, description = ?, price = ?, stock_count = ?, brand = ?, image_url = ?, is_available = ?
            WHERE id = ?
            RETURNING *;
        `, [name, category_id, description, price, stock_count, brand, image_url, is_available, id]);

            return rows[0]; // Zwraca pełny obiekt zaktualizowanego produktu

        } catch (err) {
            console.error('❌ Błąd podczas aktualizacji produktu:', err);
            throw err;
        }
    },

    // Usuwa produkt
    delete: async (id) => {
        try {
            const [deletedProduct] = await db('products')
                .where('id', id)
                .del()
                .returning('*'); // Zwraca pełny obiekt usuniętego produktu
            return deletedProduct;
        } catch (err) {
            console.error('❌ Błąd podczas usuwania produktu:', err);
            throw err;
        }
    },

    getProductsFromCategory: async (id) => {
        try {
            const products = await db
                .select("*")
                .from('products')
                .where('products.category_id', id)
                .returning('*')
            return products;
        } catch (err) {
            console.error('❌ Błąd podczas brania produktów tej kategorii:', err);
            throw err
        }
    },

    updateAll: async (column, data) => {
        try {
            const hasColumn = await db.schema.hasColumn('products', column);
            if (!hasColumn) {
                await db.schema.table('products', (table) => {
                    table.float(column);
                });
            }
            let updatedCount = 0;

            for (const item of data) {
                const result = await db('products')
                    .where('id', item.productId)
                    .update({ [column]: item.avgRating });

                updatedCount += result
            }

            return updatedCount
        } catch (err) {
            console.error('❌ Błąd podczas dodawania nowej kolumny:', err);
            throw err
        }

    },

    findSimilarProduct: async (productId) => {
        try {
            const product = await Product.getById(productId)
            const result = await db('products')
                .select("*")
                .where("category_id", product.category_id)
                .whereNot("name", product.name);
            return {name: result[0].name, price: result[0].price};
        } catch (err) {
            console.error('❌ Błąd podczas wyszukiwania podobnego produktu:', err);
            throw err;
        }
    }
};

module.exports = Product;