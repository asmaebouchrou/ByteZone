const bcrypt = require('bcryptjs');
const db = require('../config/database');

module.exports = {
    
    showTshirts: async (req, res)=>{
        const [resultado] =  await db.query('SELECT * FROM tshirt');

        res.render('client/tshirt/list', {tshirts: resultado});
    },

    showDetail: async (req, res)=>{
        let id = req.params.id;
        const [response] = await db.query(`SELECT * FROM tshirt WHERE id =? `, [id]);
        res.render('client/tshirt/detail', {detalle: response});
    }

    
}



