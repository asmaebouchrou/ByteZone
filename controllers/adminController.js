const db = require('../config/database');
module.exports = {
    showDashboard: (req, res) => {
        res.render('admin/dashboard');
    },

    showProducts: async (req, res)=>{
        try {
            let [resultado] = await db.query("SELECT * FROM product");
            res.render('admin/product/list', {products: resultado})
        } catch (error) {
             res.render('404', {
                mensaje: 'Imposible obtener productos'
            });
        }
        
    },

    addProductGET: (req, res)=>{
        res.render('admin/product/add');
    },

    addProductPOST: async (req, res)=>{
        let {category, specs, brand, stock, price, active, image} = req.body;
        active = active == '1' || active === 1 ? 1 : 0;

        let sql = 'INSERT INTO `product`' +  '(category,specs,brand, stock, price, active, image) VALUES (?,?,?,?,?,?,?)';
        try {
            await db.query(sql, [category, specs, brand, stock, price, active, image]);
            return res.redirect('/admin/products');
        } catch (error) {
            console.error(error);
            return res.render('404', {
                mensaje: 'No se pudo guardar el producto'
            });
        }
    },

    updateProductGET: async (req, res) => {
        const { id } = req.params;

        try {
            let [resultado] = await db.query(
                'SELECT * FROM product WHERE id = ?',
                [id]
            );

            if (resultado.length === 0) {
                return res.render('404', {
                    mensaje: 'Producto no encontrado'
                });
            }

            res.render('admin/product/update', {
                product: resultado[0]
            });
        } catch (error) {
            res.render('404', {
                mensaje: 'Error obteniendo producto para editar'
            });
        }
    },

    updateProductPOST: async (req, res) => {
        const { id } = req.params;
        let { category, specs, stock, price } = req.body;

        stock = Number(stock);
        price = Number(price);

        if (isNaN(stock) || isNaN(price) || stock < 0 || price < 0) {
            return res.render('error', {
                mensaje: 'Stock y precio deben ser números positivos'
            });
        }

        const sql = 'UPDATE product SET category = ?, specs = ?, stock = ?, price = ? WHERE id = ?';

        try {
            await db.query(sql, [category, specs, stock, price, id]);

            return res.redirect('/admin/products');
        } catch (error) {
            console.error(error);
            return res.render('404', {
                mensaje: 'Error actualizando producto'
            });
        }
    },

    deleteProductGET: async (req, res) => {
        const { id } = req.params;

        try {
            let [resultado] = await db.query(
                'SELECT * FROM product WHERE id = ?',
                [id]
            );

            if (resultado.length === 0) {
                return res.render('404', {
                    mensaje: 'Producto no encontrado'
                });
            }

            res.render('admin/product/delete', {
                product: resultado[0]
            });
        } catch (error) {
            console.error(error);
            res.render('404', {
                mensaje: 'Error obteniendo producto para eliminar'
            });
        }
    },

    deleteProductPOST: async (req, res) => {
        const { id } = req.params;
        const sqlDelete = 'DELETE FROM product WHERE id = ?';

        try {
            // intentamos borrar
            await db.query(sqlDelete, [id]);
            return res.redirect('/admin/products');

        } catch (error) {
            console.error(error);

            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                try {
                    const [rows] = await db.query(
                        'SELECT * FROM product WHERE id = ?',
                        [id]
                    );

                    if (rows.length === 0) {
                        return res.redirect('/admin/products');
                    }

                    return res.render('admin/product/delete', {
                        product: rows[0],
                        mensajeError: 'No se puede eliminar el producto porque tiene pedidos asociados.'
                    });
                } catch (e2) {
                    console.error(e2);
                    return res.redirect('/admin/products');
                }
            }

            return res.redirect('/admin/products');
        }
    }
};
    
