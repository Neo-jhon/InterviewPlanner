const express =  require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = express.Router()



/**
 * @routes POST /api/auth/register
 * @description Register a new user
 * @acess Public
 */
authRouter.post("/register",authController.registerUserController)


/**
 * @routes POST /api/auth/login
 * @description loginn user with email and password
 * @access public
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add token to the backlist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */

authRouter.get('/get-me', authMiddleware.authUser,authController.getMeController)

module.exports = authRouter