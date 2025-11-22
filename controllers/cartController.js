const CartModel = require("../models/CartModel");
const db = require("../config/database");
const transporter = require("../config/mailer");


module.exports = {


    viewCart(req, res) {
        const clientId = req.session.user.id;

        CartModel.getUserCart(clientId)
            .then(([rows]) => {
                if (rows.length === 0) {
                    return CartModel.createCart(clientId)
                        .then(() => CartModel.getUserCart(clientId));
                }
                return [rows];
            })
            .then(([rows]) => {
                const cart = rows[0];
                cart.total = Number(cart.total);

                CartModel.getCartItems(cart.id)
                    .then(([items]) => {
                        items = items.map(i => ({
                            ...i,
                            sale_price: Number(i.sale_price),
                            quantity: Number(i.quantity)
                        }));

                        res.render("client/cart/index", {
                            cart,
                            items
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.redirect("/cart");
                    });
            })
            .catch(err => {
                console.error(err);
                res.redirect("/cart");
            });
    },

    addItem(req, res) {
        const clientId = req.session.user.id;
        const productId = req.params.id;

        CartModel.getUserCart(clientId)
            .then(([rows]) => {
                if (rows.length === 0) {
                    return CartModel.createCart(clientId)
                        .then(() => CartModel.getUserCart(clientId));
                }
                return [rows];
            })
            .then(([rows]) => {
                const cart = rows[0];

                CartModel.findItemInCart(cart.id, productId)
                    .then(([itemRows]) => {

                        if (itemRows.length > 0) {
                            return CartModel.increaseQuantity(itemRows[0].id)
                                .then(() => cart.id);
                        } else {
                            return db.query("SELECT price FROM tshirt WHERE id = ?", [productId])
                                .then(([[product]]) => {
                                    if (!product) return res.redirect("/cart");

                                    return CartModel.insertItem(cart.id, productId, product.price)
                                        .then(() => cart.id);
                                });
                        }

                    })
                    .then(cartId => {
                        return CartModel.updateCartTotal(cartId);
                    })
                    .then(() => {
                        res.redirect("/cart");
                    })
                    .catch(err => {
                        console.error(err);
                        res.redirect("/cart");
                    });
            })
            .catch(err => {
                console.error(err);
                res.redirect("/cart");
            });
    },


    removeItem(req, res) {
        const lineId = req.params.id;
        const fullDelete = req.query.full === "1";

        db.query("SELECT * FROM customer_order_line WHERE id = ?", [lineId])
            .then(([[line]]) => {

                if (!line) return res.redirect("/cart");

                let action;

                if (fullDelete) {
                    action = CartModel.deleteItem(lineId);
                } else if (line.quantity > 1) {
                    action = CartModel.decreaseQuantity(lineId);
                } else {
                    action = CartModel.deleteItem(lineId);
                }

                action
                    .then(() => CartModel.updateCartTotal(line.customer_order))
                    .then(() => res.redirect("/cart"))
                    .catch(err => {
                        console.error(err);
                        res.redirect("/cart");
                    });

            })
            .catch(err => {
                console.error(err);
                res.redirect("/cart");
            });
    },

    processView(req, res) {
        const clientId = req.session.user.id;

        CartModel.getUserCart(clientId)
            .then(([[cart]]) => {
                CartModel.getCartItems(cart.id)
                    .then(([items]) => {
                        res.render("client/cart/process", {
                            cart,
                            items
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.redirect("/cart");
                    });
            })
            .catch(err => {
                console.error(err);
                res.redirect("/cart");
            });
    },

    processBuy(req, res) {
        const clientId = req.session.user.id;

        CartModel.getUserCart(clientId)
            .then(([[cart]]) => {

                db.query(
                    "UPDATE customer_order SET status='paid' WHERE id = ?",
                    [cart.id]
                )
                .then(() => {
                    return db.query(
                        `INSERT INTO payment (customer_order_id, amount, status)
                         VALUES (?, ?, 'COMPLETED')`,
                        [cart.id, cart.total]
                    );
                })
                .then(() => {
                    res.redirect(`/orders/${cart.id}`);
                })
                .catch(err => {
                    console.error(err);
                    res.redirect("/cart");
                });

            })
            .catch(err => {
                console.error(err);
                res.redirect("/cart");
            });
    }
};
