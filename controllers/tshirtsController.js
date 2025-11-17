const bcrypt = require('bcryptjs');
const db = require('../config/database');

module.exports = {
    
    showTshirts: async (req, res)=>{
        const [resultado] =  await db.query('SELECT * FROM tshirt');

        res.render('client/tshirt/list', {tshirts: resultado});
    },

    showDetailTshirt:(req, res)=>{
        res.render('client/home');
    }
}



