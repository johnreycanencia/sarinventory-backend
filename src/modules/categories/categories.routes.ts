import { Router } from "express";
import categoryController from "./categories.controller.js";
import authMiddleware from "../../shared/middleware/verifyJWT.js";

const categoryRouter = Router();

categoryRouter.get("/", authMiddleware, categoryController.getCategories);

export default categoryRouter;