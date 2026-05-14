const db = require("../config/database");

module.exports = {

    // Obtener carrito del usuario
    getUserCart(clientId) {
        const sql = `
            SELECT *
            FROM customer_order
            WHERE client = ? AND status = 'cart'
            LIMIT 1
        `;
        return db.query(sql, [clientId]);
    },

    // Crear carrito vacío
    createCart(clientId) {
        const sql = `
            INSERT INTO customer_order (client, status, total)
            VALUES (?, 'cart', 0)
        `;
        return db.query(sql, [clientId]);
    },

    // Obtener items con quantity incluida
    getCartItems(cartId) {
        const sql = `
        SELECT 
            col.id,
            col.product,
            col.quantity,
            col.sale_price,
            product.category,
            product.specs,
            product.brand
        FROM customer_order_line col
        JOIN product ON product.id = col.product
        WHERE col.customer_order = ?
`;
        return db.query(sql, [cartId]);
    },


    // Ver si el producto ya existe en el carrito
    findItemInCart(cartId, productId) {
        const sql = `
            SELECT *
            FROM customer_order_line
            WHERE customer_order = ? AND product = ?
            LIMIT 1
        `;
        return db.query(sql, [cartId, productId]);
    },

    // Insertar un nuevo producto en el carrito
    insertItem(cartId, productId, price) {
        const sql = `
            INSERT INTO customer_order_line (customer_order, product, sale_price, quantity)
            VALUES (?, ?, ?, 1)
        `;
        return db.query(sql, [cartId, productId, price]);
    },

    // Incrementar cantidad
    increaseQuantity(lineId) {
        const sql = `
            UPDATE customer_order_line
            SET quantity = quantity + 1
            WHERE id = ?
        `;
        return db.query(sql, [lineId]);
    },

    // Bajar cantidad
    decreaseQuantity(lineId) {
        const sql = `
            UPDATE customer_order_line
            SET quantity = quantity - 1
            WHERE id = ?
        `;
        return db.query(sql, [lineId]);
    },

    // Eliminar item completamente
    deleteItem(lineId) {
        const sql = `
            DELETE FROM customer_order_line
            WHERE id = ?
        `;
        return db.query(sql, [lineId]);
    },

    // Recalcular total del carrito
    updateCartTotal(cartId) {
        const sql = `
            UPDATE customer_order
            SET total = (
                SELECT COALESCE(SUM(sale_price * quantity), 0)
                FROM customer_order_line
                WHERE customer_order = ?
            )
            WHERE id = ?
        `;
        return db.query(sql, [cartId, cartId]);
    },

};
