const Database = require("better-sqlite3");

const db = new Database("./database/economy.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
    userId TEXT PRIMARY KEY,
    wallet INTEGER DEFAULT 0,
    lastWork INTEGER DEFAULT 0,
    lastBeg INTEGER DEFAULT 0
)
`).run();

module.exports = db;