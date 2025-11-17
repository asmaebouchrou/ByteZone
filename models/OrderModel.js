const db = require("../config/database");

module.exports = {

    async getOrdersByUser(userId) {
        const sql = `
            SELECT id, date, status, total
            FROM customer_order
            WHERE client = ? AND status != 'cart'
            ORDER BY date DESC
        `;
        const [rows] = await db.query(sql, [userId]);
        return rows;
    },

    async getOrderById(orderId, userId) {
        const sql = `
            SELECT id, date, status, total
            FROM customer_order
            WHERE id = ? AND client = ? AND status != 'cart'
            LIMIT 1
        `;
        const [[row]] = await db.query(sql, [orderId, userId]);
        return row;
    }

};
