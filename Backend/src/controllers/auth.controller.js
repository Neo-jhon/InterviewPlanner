const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

// Shared cookie config — keeps both register & login in sync
const COOKIE_OPTIONS = {
    httpOnly: true,                                              // JS can't read the cookie (XSS protection)
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" needed for cross-origin in prod
    secure: process.env.NODE_ENV === "production",               // HTTPS only in prod
    maxAge: 24 * 60 * 60 * 1000                                 // 1 day in ms
}

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({ username, email, password: hash })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, COOKIE_OPTIONS) // ✅ Fixed cookie options

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("registerUserController error:", error)
        res.status(500).json({ message: error.message })
    }
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, COOKIE_OPTIONS) // ✅ Fixed cookie options

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("loginUserController error:", error)
        res.status(500).json({ message: error.message })
    }
}

/**
 * @name logoutUserController
 * @description clear token from cookie and add the token to blacklist
 * @access Public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token
        if (token) {
            await tokenBlacklistModel.create({ token })
        }
        res.clearCookie("token", COOKIE_OPTIONS) // ✅ Must use same options to clear properly

        res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.error("logoutUserController error:", error)
        res.status(500).json({ message: error.message })
    }
}

/**
 * @name getMeController
 * @description get current logged in user details
 * @access Private
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("getMeController error:", error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}