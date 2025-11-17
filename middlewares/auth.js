//middleware para cuando el usuario es normal
module.exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  console.log("Not logged in → redirect to /auth/login");
  return res.redirect('/auth/login');
};

//middleware para cuando el usuario es admin
module.exports.isAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    console.log("Not logged in → redirect to /auth/login");
    return res.redirect('/auth/login');
  }

  if (req.session.user.role !== 'admin') {
    console.log("User is not admin");
    return res.status(403).send("Forbidden");
  }

  console.log("Admin authenticated");
  next();
};
