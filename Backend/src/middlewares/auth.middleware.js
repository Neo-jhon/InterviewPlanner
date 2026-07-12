const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function authUser(req, res, next) {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: "Token not provided." })
        }

        // ✅ Wrapped blacklist check in try/catch so a DB hiccup doesn't crash the server
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })
        if (isTokenBlacklisted) {
            return res.status(401).json({ message: "Token is invalid." })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()

    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." })
    }
}

module.exports = { authUser }