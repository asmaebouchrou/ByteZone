const db = require("../config/database");

module.exports = {


    getDetailsByOrderId(orderId, callback) {
        const sql = `
            SELECT 
                col.id,
                col.quantity,
                col.sale_price,
                product.brand,
                product.category,
                product.specs
            FROM customer_order_line col
            JOIN product ON product.id = col.product
            WHERE col.customer_order = ?
        `;

        db.query(sql, [orderId])
            .then(([rows]) => callback(null, rows))
            .catch(err => callback(err, null));
    }
};
