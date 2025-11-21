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

    addTshirtGET: (req, res)=>{
        res.render('admin/tshirt/add');
    },

    addTshirtPOST: (req, res)=>{
        //console.log(req.body);
        let {size, gender, color, brand, 
            stock, price, active, image} = req.body;
        active = active == '1' || active === 1 ? 1 : 0;

        let sql = 'INSERT INTO `tshirt`' +  '(size,gender,color,brand, stock, price, active, image) VALUES (?,?,?,?,?,?,?,?)';
        db.query(sql, [size, gender, color, brand, 
            stock, price, active, image], (error, resultado)=>{
                if(error){
                    res.render('error', {
                        mensaje: 'Impossible to access the shirt '
                    })
                }else{
                    //Lo hacemos manual
                    window.location= '/admin/tshirt';
                    
                    //No funciona ya que la peticion se hace en segundo plano
                    //el servidor devuelve un estado 302 pero NO hace que cambie
                    //de endpoint, solo hace lo que se pide
                    //res.redirect('/admin/tshirt');
                }
            })
        res.redirect('/admin/tshirt');

        
    }
    
}