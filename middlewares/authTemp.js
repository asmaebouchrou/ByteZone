module.exports = (req, res, next) => {
    console.log("Middleware temporal (pendiente de implementación real)");
    req.session.user = { id: 5 }; // TEMPORAL
    next();
};
