import { Router } from "express";
import userController from "./user.controller.js";
import authMiddleware from "../../shared/middleware/verifyJWT.js";

const userRouter = Router();

userRouter.get("/", authMiddleware, userController.getUser);

export default userRouter;