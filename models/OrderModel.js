const db = require("../config/database");

module.exports = {

    getOrdersByUser(userId, callback) {
        const sql = `
            SELECT id, date, status, total
            FROM customer_order
            WHERE client = ? AND status != 'cart'
            ORDER BY date DESC
        `;

        db.query(sql, [userId])
            .then(([rows]) => callback(null, rows))
            .catch(err => callback(err, null));
    },


    getOrderById(orderId, userId, callback) {
        const sql = `
            SELECT id, date, status, total
            FROM customer_order
            WHERE id = ? AND client = ? AND status != 'cart'
            LIMIT 1
        `;

        db.query(sql, [orderId, userId])
            .then(([rows]) => {
                const order = rows.length > 0 ? rows[0] : null;
                callback(null, order);
            })
            .catch(err => callback(err, null));
    }
};
