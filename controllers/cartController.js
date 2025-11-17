const CartModel = require("../models/CartModel");
const db = require("../config/database");

module.exports = {

    // ---------------------------------------------------------
    // VER CARRITO
    // ---------------------------------------------------------
    async viewCart(req, res) {
        const clientId = req.session.user.id;

        let [rows] = await CartModel.getUserCart(clientId);
        if (rows.length === 0) {
            await CartModel.createCart(clientId);
            [rows] = await CartModel.getUserCart(clientId);
        }

        const cart = rows[0];
        cart.total = Number(cart.total);

        let [items] = await CartModel.getCartItems(cart.id);

        items = items.map(i => ({
            ...i,
            sale_price: Number(i.sale_price),
            quantity: Number(i.quantity)
        }));

        res.render("client/cart/index", {
            cart,
            items
        });
    },

    // ---------------------------------------------------------
    // AÑADIR PRODUCTO
    // ---------------------------------------------------------
    async addItem(req, res) {
        const clientId = req.session.user.id;
        const productId = req.params.id;

        let [rows] = await CartModel.getUserCart(clientId);
        if (rows.length === 0) {
            await CartModel.createCart(clientId);
            [rows] = await CartModel.getUserCart(clientId);
        }

        const cart = rows[0];
        const [itemRows] = await CartModel.findItemInCart(cart.id, productId);

        if (itemRows.length > 0) {
            await CartModel.increaseQuantity(itemRows[0].id);
        } else {
            const [[product]] = await db.query(
                "SELECT price FROM tshirt WHERE id = ?",
                [productId]
            );
            if (!product) return res.redirect("/cart");

            await CartModel.insertItem(cart.id, productId, product.price);
        }

        await CartModel.updateCartTotal(cart.id);

        res.redirect("/cart");
    },

    // ---------------------------------------------------------
    // QUITAR PRODUCTO
    // ---------------------------------------------------------
    async removeItem(req, res) {
        const lineId = req.params.id;
        const fullDelete = req.query.full === "1";

        const [[line]] = await db.query(
            "SELECT * FROM customer_order_line WHERE id = ?",
            [lineId]
        );

        if (!line) return res.redirect("/cart");

        if (fullDelete) {
            await CartModel.deleteItem(lineId);
        } else if (line.quantity > 1) {
            await CartModel.decreaseQuantity(lineId);
        } else {
            await CartModel.deleteItem(lineId);
        }

        await CartModel.updateCartTotal(line.customer_order);

        res.redirect("/cart");
    },

    // ---------------------------------------------------------
    // PANTALLA DE CHECKOUT
    // ---------------------------------------------------------
    async processView(req, res) {
    const clientId = req.session.user.id;

    const [[cart]] = await CartModel.getUserCart(clientId);
    let [items] = await CartModel.getCartItems(cart.id);

    // Convertir valores numéricos
    items = items.map(i => ({
        ...i,
        sale_price: Number(i.sale_price),
        quantity: Number(i.quantity)
    }));

    cart.total = Number(cart.total);

    res.render("client/cart/process", {
        cart,
        items
    });
},

    // ---------------------------------------------------------
    // PROCESAR COMPRA
    // ---------------------------------------------------------
    async processBuy(req, res) {
    const clientId = req.session.user.id;

    const [[cart]] = await CartModel.getUserCart(clientId);

    // 1 Marcar pedido como pagado + fecha
    await db.query(
        `UPDATE customer_order 
         SET status='paid', date = NOW()
         WHERE id = ?`,
        [cart.id]
    );

    // 2 Registrar pago
    await db.query(
        `INSERT INTO payment (customer_order_id, amount, status)
         VALUES (?, ?, 'COMPLETED')`,
        [cart.id, cart.total]
    );

    // 3Crear carrito nuevo vacío para el usuario
    await CartModel.createCart(clientId);

    // 4 Redirigir a la pantalla del pedido terminado
    res.redirect(`/orders/${cart.id}`);
}
};