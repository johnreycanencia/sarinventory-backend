import { Router } from "express";
import authController from "./auth.controller.js";
import cookieRefreshTokenExist from "./middleware/cookieRefreshTokenExist.js";
import registerInputValidator from "./middleware/registerInputValidator.js";
import loginInputValidator from "./middleware/loginInputValidator.js";
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        error: {
            message: "Too many login attemps. Please try again later.",
        }
    },
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        error: {
            message: "Too many registration attempts. Please try again later.",
        }
    },
    standardHeaders: "draft-8",
    legacyHeaders: false,
})

const authRouter = Router();

authRouter.post("/register", registerLimiter, registerInputValidator, authController.register);
authRouter.post("/login", loginLimiter, loginInputValidator, authController.login);
authRouter.post("/refresh", cookieRefreshTokenExist, authController.refresh); // Include Frontend Credentials
authRouter.post("/logout", cookieRefreshTokenExist, authController.logout);

export default authRouter;