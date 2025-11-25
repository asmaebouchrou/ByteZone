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

        
    },
    
    // ========================
    //        UPDATE
    // ========================

    // GET /admin/tshirt/update/:id → muestra el formulario con datos
    updateTshirtGET: async (req, res) => {
        const { id } = req.params;

        try {
            let [resultado] = await db.query(
                'SELECT * FROM tshirt WHERE id = ?',
                [id]
            );

            if (resultado.length === 0) {
                return res.render('404', {
                    mensaje: 'Tshirt not found'
                });
            }

            res.render('admin/tshirt/update', {
                tshirt: resultado[0]
            });
        } catch (error) {
            res.render('error', {
                mensaje: 'Error getting tshirt for update'
            });
        }
    },

    // POST /admin/tshirt/update/:id → guarda cambios
    updateTshirtPOST: (req, res) => {
        const { id } = req.params;
        let { size, color, stock, price } = req.body;

        // Validación simple
        stock = Number(stock);
        price = Number(price);

        if (isNaN(stock) || isNaN(price) || stock < 0 || price < 0) {
            return res.render('error', {
                mensaje: 'Stock y precio deben ser números positivos'
            });
        }

        const sql = 'UPDATE tshirt SET size = ?, color = ?, stock = ?, price = ? WHERE id = ?';

        db.query(sql, [size, color, stock, price, id], (error, resultado) => {
            if (error) {
                return res.render('error', {
                    mensaje: 'Error updating tshirt'
                });
            }

            res.redirect('/admin/tshirt');
        });
    },

    // GET /admin/tshirt/delete/:id
    deleteTshirtGET: async (req, res) => {
        const { id } = req.params;

        try {
            let [resultado] = await db.query(
                'SELECT * FROM tshirt WHERE id = ?',
                [id]
            );

            if (resultado.length === 0) {
                return res.render('404', {
                    mensaje: 'Tshirt not found'
                });
            }

            res.render('admin/tshirt/delete', {
                tshirt: resultado[0]
            });
        } catch (error) {
            console.error(error);
            res.render('error', {
                mensaje: 'Error getting tshirt for delete'
            });
        }
    },

    // POST /admin/tshirt/delete/:id
    deleteTshirtPOST: async (req, res) => {
        const { id } = req.params;

        const sql = 'DELETE FROM tshirt WHERE id = ?';

        try {
            await db.query(sql, [id]);

            res.redirect('/admin/tshirt');
        } catch (error) {
            console.error(error);

            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.render('error', {
                    mensaje: 'No se puede eliminar la camiseta porque tiene pedidos asociados.'
                });
            }

            res.render('error', {
                mensaje: 'Error deleting tshirt'
            });
        }
    }
};
    