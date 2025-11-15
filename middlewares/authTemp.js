module.exports = {
    isAuthenticated: (req, res, next) => {
        // Middleware temporal para no bloquear el desarrollo
        console.log("Middleware temporal isAuthenticated (pendiente de implementación real)");
        next(); 
    }
};
