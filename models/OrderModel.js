module.exports = {

    // Crear un pedido (insert en la tabla orders)
    createOrder: async (userId, total) => {
        // TODO: implementar INSERT en la BD y devolver el ID del pedido
        return null;
    },

    // Obtener todos los pedidos de un usuario
    getOrdersByUser: async (userId) => {
        // TODO: SELECT * FROM orders WHERE user_id = ?
        return [];
    },

    // Obtener un pedido concreto por ID
    getOrderById: async (orderId) => {
        // TODO: SELECT * FROM orders WHERE id = ?
        return null;
    }

};
