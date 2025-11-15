// app.js
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos (imágenes, css, js si los añades después)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para renderizar la página principal (index.pug)
app.get('/', (req, res) => {
  res.render('index'); // Renderiza views/index.pug
});

//Ruta para ir al carrito
const cartRoutes = require('./routes/cart.routes');
app.use('/', cartRoutes);


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
