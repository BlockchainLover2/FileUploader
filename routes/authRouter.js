const express = require('express')
const authRouter = express.Router()
const userController = require("../controllers/UserController")


authRouter.get("/sign-up", userController.createUserGet)

authRouter.post("/sign-up",userController.createUserPost)

authRouter.get("/log-in", userController.loginGet)

authRouter.post("/log-in",userController.loginPost)

authRouter.post("/log-out",userController.logoutPost)

authRouter.post("/share",userController.createShareLink)


module.exports = authRouter