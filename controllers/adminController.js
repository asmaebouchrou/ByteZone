const db = require('../config/database');
module.exports = {
    showTshirts: async (req, res)=>{
        try {
            let [resultado] = await db.query("SELECT * FROM tshirt");
            res.render('admin/tshirt/list', {tshirts: resultado})
        } catch (error) {
             res.render('404', {
                mensaje: 'Imposible to get tshirts'
            });
        }
        
    },
}