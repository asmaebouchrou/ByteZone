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

//AUTH MIDDLEWARES

const { isAuthenticated, isAdmin } = require('./middlewares/auth');

//TEMPLATE ENGINE (PUG)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//BODY PARSING
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//SESSION CONFIG
app.use(
  session({
    secret: 'TuVozRegoLaDunaDeMiPecho',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,      // Necesario en HTTP local, si lo pones en TRUE peta 
      httpOnly: true,
      maxAge: 1000 * 60 * 60 // 1 hora de vida para la cookie
    }
  })
);

//STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

//ROUTES
//Publicas
app.use('/auth', authRoutes);
app.use('/profile',isAuthenticated, profileRoutes);


// Rutas que hace falta estar loggeado
// app.use('/cart', isAuthenticated, cartRoutes);
// app.use('/profile', isAuthenticated, profileRoutes);
// app.use('/orders', isAuthenticated, orderRoutes);

// Rutas de admin, aqui va el panel de admin
// app.use('/admin', isAdmin, adminRoutes);

// Página principal
app.get('/', (req, res) => {
  res.render('layouts/adminLayout'); // Renderiza views/index.pug
});

//SERVER START
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
