module.exports = {
    about: (req, res) => {
        res.render('client/pages/about');
    },

    contact: (req, res) => {
        res.render('client/pages/contact');
    },

    privacy: (req, res) => {
        res.render('client/pages/privacy');
    },

    terms: (req, res) => {
        res.render('client/pages/terms');
    }
};
