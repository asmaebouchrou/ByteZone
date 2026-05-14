const db = require('../config/database');

module.exports = {
    
    showProducts: async (req, res)=>{
        const { search = '', category = '' } = req.query;
        const params = [];
        const where = ['active = TRUE'];

        if (search.trim()) {
            where.push('(brand LIKE ? OR specs LIKE ? OR category LIKE ?)');
            const term = `%${search.trim()}%`;
            params.push(term, term, term);
        }

        const categoryGroups = {
            peripherals: ['keyboard', 'mouse', 'headset', 'monitor']
        };

        if (category.trim()) {
            const selected = category.trim();
            if (categoryGroups[selected]) {
                where.push(`category IN (${categoryGroups[selected].map(() => '?').join(',')})`);
                params.push(...categoryGroups[selected]);
            } else {
                where.push('category = ?');
                params.push(selected);
            }
        }

        const categoryLabels = {
            ram: 'RAM',
            ssd: 'SSD',
            processor: 'Procesadores',
            graphics_card: 'Tarjetas gráficas',
            motherboard: 'Placas base',
            power_supply: 'Fuentes de alimentación',
            case: 'Cajas',
            cooling: 'Refrigeración',
            monitor: 'Monitores',
            keyboard: 'Teclados',
            mouse: 'Ratones',
            headset: 'Auriculares',
            peripherals: 'Periféricos',
            accessory: 'Accesorios'
        };

        const [resultado] = await db.query(
            `SELECT * FROM product WHERE ${where.join(' AND ')} ORDER BY category, brand`,
            params
        );

        res.render('client/product/list', {
            products: resultado.map(product => ({
                ...product,
                categoryLabel: categoryLabels[product.category] || product.category
            })),
            search,
            selectedCategory: category,
            categoryLabel: categoryLabels[category] || category
        });
    },

    showDetail: async (req, res)=>{
        let id = req.params.id;
        const [response] = await db.query(`SELECT * FROM product WHERE id =? `, [id]);
        const categoryLabels = {
            ram: 'RAM',
            ssd: 'SSD',
            processor: 'Procesadores',
            graphics_card: 'Tarjetas gráficas',
            motherboard: 'Placas base',
            power_supply: 'Fuentes de alimentación',
            case: 'Cajas',
            cooling: 'Refrigeración',
            monitor: 'Monitores',
            keyboard: 'Teclados',
            mouse: 'Ratones',
            headset: 'Auriculares',
            accessory: 'Accesorios'
        };
        res.render('client/product/detail', {
            detalle: response.map(product => ({
                ...product,
                categoryLabel: categoryLabels[product.category] || product.category
            }))
        });
    }

    
}
