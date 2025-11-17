const db = require("../config/database");

module.exports = {

    async getDetailsByOrderId(orderId) {
        const sql = `
            SELECT 
                col.id,
                col.quantity,
                col.sale_price,
                tshirt.brand,
                tshirt.color,
                tshirt.size
            FROM customer_order_line col
            JOIN tshirt ON tshirt.id = col.product
            WHERE col.customer_order = ?
        `;
        const [rows] = await db.query(sql, [orderId]);
        return rows;
    }

};
