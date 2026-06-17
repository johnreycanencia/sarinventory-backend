import { Router } from "express";
import productController from "./products.controller.js";
import authMiddleware from "../../shared/middleware/verifyJWT.js";

const productRouter = Router();

productRouter.post("/", authMiddleware, productController.insert);
productRouter.get("/", authMiddleware, productController.getProducts);
productRouter.get("/:id", authMiddleware, productController.getProductById);
productRouter.patch("/:id", authMiddleware, productController.updateProduct);
productRouter.delete("/:id", authMiddleware, productController.deleteProduct);

export default productRouter;