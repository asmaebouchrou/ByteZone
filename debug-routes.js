const app = require('./app');

console.log("RUTAS REGISTRADAS EN EXPRESS:");
app._router.stack.forEach((layer) => {
    if (layer.route) {
        console.log(layer.route.path, layer.route.methods);
    }
});
