
// Middleware to check if user is logged in before being able to perform any crud operations
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "You must be logged in to perform this action." })
    }
    next()
}

module.exports = { isAuthenticated };