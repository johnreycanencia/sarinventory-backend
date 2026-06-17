import { Router } from "express";
import authMiddleware from "../../shared/middleware/verifyJWT.js";
import transactionController from "./transactions.controller.js";

const transactionRouter = Router();

transactionRouter.post("/", authMiddleware, transactionController.transaction);
transactionRouter.get("/history", authMiddleware, transactionController.transactionHistory);
transactionRouter.get("/items", authMiddleware, transactionController.transactionItems);

export default transactionRouter;