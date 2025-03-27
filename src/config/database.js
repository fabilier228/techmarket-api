const knex = require('knex')
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_NAME)
console.log(process.env.DB_HOST)


const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    }
})
const initDb = async () => {
    try {
        const initScript = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
        await db.raw(initScript);
        console.log('✅ Baza danych została zainicjalizowana.');
    } catch (err) {
        console.error('❌ Błąd inicjalizacji bazy danych:', err);
    }
};

initDb();

module.exports = db;
