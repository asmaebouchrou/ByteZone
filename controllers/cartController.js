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

};
