const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//ROUTERS
const authRoutes = require('./routes/authRouter');
const profileRoutes = require('./routes/profileRouter')
const adminUserRoutes = require('./routes/adminUserRouter');
const adminRoutes = require('./routes/adminRouter');
const productsRoutes = require('./routes/productsRouter');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const pagesRoutes = require('./routes/pages.routes');



//AUTH MIDDLEWARES
const { isAuthenticated, isAdmin } = require('./middlewares/auth');
const adminController = require('./controllers/adminController');

//TEMPLATE ENGINE (PUG)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos (imágenes, css, js si los añades después)
app.use(express.static(path.join(__dirname, 'public')));

//BODY PARSING
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//SESSION CONFIG
app.use(
  session({
    secret: 'bytezone-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,      // Necesario en HTTP local, si lo pones en TRUE peta 
      httpOnly: true,
      maxAge: 1000 * 60 * 60 // 1 hora de vida para la cookie
    }
  })
);

//ROUTES
//Publicas
app.use('/auth', authRoutes);
app.use('/profile',isAuthenticated, profileRoutes);

app.use('/profile', isAuthenticated, profileRoutes);
app.use('/products', productsRoutes);
app.use('/', pagesRoutes);

// Rutas que hace falta estar loggeado
// app.use('/profile', isAuthenticated, profileRoutes);
// app.use('/orders', isAuthenticated, orderRoutes);

// Rutas de admin, aqui va el panel de admin
// Primero rutas específicas de admin user para no quedar detrás del prefijo /admin
app.use('/admin/user', isAdmin, adminUserRoutes);
// app.use('/admin', isAdmin, adminRoutes);
app.use('/admin', isAdmin, adminRoutes);

//Ruta para ir al carrito
//isAuthenticated lo he hecho en el cart.routes,por lo cual no hace falta ponerlo aqui 
app.use('/', cartRoutes);

//ruta para ir a pedidos
app.use('/', orderRoutes);


// Página principal
app.get('/', (req, res) => {
  res.render('client/home'); // Renderiza views/index.pug
});

// Ruta principal para renderizar la página principal (index.pug)
app.get('/index', (req, res) => {
  res.render('index'); // Renderiza views/index.pug
});

//SERVER START
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
