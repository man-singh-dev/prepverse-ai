const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const authRouter = Router();

// user register karne ke liye route
authRouter.post("/register", authController.registerUserController);

// user login karne ke liye route
authRouter.post("/login", authController.loginUserController);

// expired access token ke liye naya token lene ka route
authRouter.post("/refresh", authController.refreshTokenController);

// user logout karne ke liye route
authRouter.post("/logout", authController.logoutUserController);

// protected user information check karne ke liye test route
authRouter.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "You are authenticated",
        user: req.user
    });
});

module.exports = authRouter;