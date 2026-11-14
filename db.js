const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function initDb() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            password_hash TEXT
        )
    `);
    const { rows } = await pool.query("SELECT COUNT(*) FROM users");
    if (Number (rows[0].count) === 0) {
        const seed = [
            ["admin", "123456"],
            ["ana", "password"],
            ["marko", "qwerty"],
        ];
        for (const [username, password] of seed) {
            await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password])
        }

    }
}

module.exports = { pool, initDb };