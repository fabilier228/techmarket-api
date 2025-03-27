const { Pool } = require('pg');
const fs = require('fs');
const { Sequelize } = require("sequelize");
const path = require('path');
require('dotenv').config();

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_NAME)
console.log(process.env.DB_HOST)


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});
const initDb = async () => {
    try {
        const initScript = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
        await pool.query(initScript);
        console.log('✅ Baza danych została zainicjalizowana.');
    } catch (err) {
        console.error('❌ Błąd inicjalizacji bazy danych:', err);
    }
};

initDb();

module.exports = pool
