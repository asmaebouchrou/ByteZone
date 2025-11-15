const OrderModel = require('../models/OrderModel');
const OrderDetailModel = require('../models/OrderDetailModel');

module.exports = {

    orderList: async (req, res) => {
        res.render('client/order/list');
    },

    orderDetail: async (req, res) => {
        res.render('client/order/detail');
    }

};
