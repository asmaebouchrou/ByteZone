module.exports = {

    viewCart: (req, res) => {
        res.render('client/cart/index', {});
    },

    addToCart: (req, res) => {
        res.redirect('/cart');
    },

    deleteFromCart: (req, res) => {
        res.redirect('/cart');
    },
    processBuyView: (req, res) => {
        res.render('client/cart/procesar');
    },

    processBuy: async (req, res) => {
        // TODO: crear pedido en la BD y vaciar carrito
        res.redirect('/orders');
    },


};

