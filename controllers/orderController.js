const OrderModel = require('../models/OrderModel');
const OrderDetailModel = require('../models/OrderDetailModel');

module.exports = {

 
    orderList(req, res) {
        const userId = req.session.user.id;

        OrderModel.getOrdersByUser(userId, (err, orders) => {
            if (err) {
                console.error("ERROR loading orders:", err);
                return res.redirect('/');
            }

            // Aplanar y convertir números
            orders = orders.map(o => {
                const order = { ...o };
                order.total = parseFloat(order.total) || 0;
                return order;
            });

            res.render("client/order/list", { orders });
        });
    },

    orderDetail(req, res) {
        const userId = req.session.user.id;
        const orderId = req.params.id;

        OrderModel.getOrderById(orderId, userId, (err, order) => {
            if (err) {
                console.error("ERROR loading order:", err);
                return res.redirect('/orders');
            }

            if (!order) {
                // Pedido no existe o no pertenece a ese usuario
                return res.redirect('/orders');
            }

            // Convertir pedido a formato plano
            order = {
                ...order,
                total: parseFloat(order.total) || 0
            };

            // Cargar líneas del pedido
            OrderDetailModel.getDetailsByOrderId(orderId, (err, items) => {
                if (err) {
                    console.error("ERROR loading order items:", err);
                    return res.redirect('/orders');
                }

                // Aplanar conversiones numéricas
                items = items.map(i => {
                    return {
                        ...i,
                        sale_price: parseFloat(i.sale_price) || 0,
                        quantity: parseInt(i.quantity) || 0
                    };
                });

                res.render("client/order/detail", {
                    order,
                    items
                });
            });
        });
    }

};
