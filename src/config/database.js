const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123',
    port: 5432,
});

const initDb = async () => {
    const initScript = fs.readFileSync(path.join(__dirname, 'init.sql')).toString();
    try {
        await pool.query(initScript);
        console.log('Baza danych została zainicjalizowana.');
    } catch (err) {
        console.error('Błąd inicjalizacji bazy danych:', err);
    }
};

initDb();

module.exports = pool;