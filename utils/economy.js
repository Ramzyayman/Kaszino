const db = require("../database/database");

function createUser(userId) {

    db.prepare(`
        INSERT OR IGNORE INTO users (userId)
        VALUES (?)
    `).run(userId);

}

function getUser(userId) {

    createUser(userId);

    return db.prepare(`
        SELECT *
        FROM users
        WHERE userId = ?
    `).get(userId);

}

function addMoney(userId, amount) {

    createUser(userId);

    db.prepare(`
        UPDATE users
        SET wallet = wallet + ?
        WHERE userId = ?
    `).run(amount, userId);

}

function removeMoney(userId, amount) {

    createUser(userId);

    db.prepare(`
        UPDATE users
        SET wallet = wallet - ?
        WHERE userId = ?
    `).run(amount, userId);

}

function setLastWork(userId, time) {

    db.prepare(`
        UPDATE users
        SET lastWork = ?
        WHERE userId = ?
    `).run(time, userId);

}

function setLastBeg(userId, time) {

    db.prepare(`
        UPDATE users
        SET lastBeg = ?
        WHERE userId = ?
    `).run(time, userId);

}

function setMoney(userId, amount) {

    createUser(userId);

    db.prepare(`
        UPDATE users
        SET wallet = ?
        WHERE userId = ?
    `).run(amount, userId);

}

function resetUser(userId) {

    createUser(userId);

    db.prepare(`
        UPDATE users
        SET
            wallet = 0,
            lastWork = 0,
            lastBeg = 0
        WHERE userId = ?
    `).run(userId);

}

function getLeaderboard(limit = 10) {

    return db.prepare(`
        SELECT *
        FROM users
        ORDER BY wallet DESC
        LIMIT ?
    `).all(limit);

}

module.exports = {
    createUser,
    getUser,
    addMoney,
    removeMoney,
    setMoney,
    setLastWork,
    setLastBeg,
    resetUser,
    getLeaderboard
};

