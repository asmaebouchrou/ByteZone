const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const homeRoutes = require('./routes/home.routes');
app.use('/', homeRoutes);

const cartRoutes = require('./routes/cart.routes');
app.use('/', cartRoutes);

const orderRoutes = require('./routes/order.routes');
app.use('/', orderRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
