import { Router } from "express";
import authMiddleware from "../../shared/middleware/verifyJWT.js";
import dashboardController from "./dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/overview", authMiddleware, dashboardController.financialSummary);

export default dashboardRouter;