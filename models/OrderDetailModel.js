module.exports = {

    // Crear una línea de pedido (insert en order_details)
    createOrderDetail: async (orderId, productId, price) => {
        // TODO: INSERT en order_details
        return null;
    },

    // Obtener todas las líneas de un pedido
    getDetailsByOrderId: async (orderId) => {
        // TODO: SELECT * FROM order_details WHERE order_id = ?
        return [];
    }

};
