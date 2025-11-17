const OrderModel = require('../models/OrderModel');
const OrderDetailModel = require('../models/OrderDetailModel');

module.exports = {

    // LISTA DE PEDIDOS
    async orderList(req, res) {
        const userId = req.session.user.id;

        let orders = await OrderModel.getOrdersByUser(userId);

        orders = orders.map(o => {
            o = JSON.parse(JSON.stringify(o));
            o.total = parseFloat(o.total) || 0;
            return o;
        });

        res.render("client/order/list", { orders });
    },

    // DETALLE DE UN PEDIDO
    async orderDetail(req, res) {
        const userId = req.session.user.id;
        const orderId = req.params.id;

        let order = await OrderModel.getOrderById(orderId, userId);
        if (!order) return res.redirect("/orders");

        // Aplanar pedido
        order = JSON.parse(JSON.stringify(order));
        order.total = parseFloat(order.total) || 0;

        let items = await OrderDetailModel.getDetailsByOrderId(orderId);

        items = items.map(i => {
            // Aplanar
            i = JSON.parse(JSON.stringify(i));

            // Convertir numéricos
            i.sale_price = parseFloat(i.sale_price) || 0;
            i.quantity = parseInt(i.quantity) || 0;

            return i;
        });

        res.render("client/order/detail", { order, items });
    }

};
