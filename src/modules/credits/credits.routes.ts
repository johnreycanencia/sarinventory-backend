import { Router } from "express";
import authMiddleware from "../../shared/middleware/verifyJWT.js";
import creditController from "./credits.controller.js";

const creditRouter = Router();

creditRouter.get("/customers", authMiddleware, creditController.customers);
creditRouter.post("/customer/credits", authMiddleware, creditController.customerCredits);
creditRouter.post("/payment", authMiddleware, creditController.payment);

export default creditRouter;