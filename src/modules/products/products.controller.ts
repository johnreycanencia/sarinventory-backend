import { Request, Response } from "express";
import productService from "./products.service.js";
import { AuthRequest } from "../../shared/middleware/verifyJWT.js";

const productController = {
    insert: async (req: AuthRequest, res: Response) => {
        const productData = req.body;
        const userId = req.user!.id;
        const product = await productService.insertProduct({...productData, userId});

        return res.status(201).json({
            success: true,
            message: "Product Added",
            data: {
                product,
            },
        });
    },
    getProducts: async (req: AuthRequest, res: Response) => {

        const userId = req.user!.id;
        const products = await productService.getProducts(userId);

        return res.status(200).json({
            success: true,
            message: "Products Retrieved",
            data: {
                products,
            },
        });
    },
    getProductById: async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const userId = req.user!.id;
        const product = await productService.getProductById(id, userId);

        return res.status(200).json({
            success: true,
            message: "Product Retrieved",
            data: {
                product,
            },
        });
    },
    updateProduct: async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const productData = req.body;
        const userId = req.user!.id;
        const updatedProduct = await productService.updateProduct(id, productData, userId);

        return res.status(200).json({
            success: true,
            message: "Product Updated",
            data: {
                product: updatedProduct,
            },
        });
    },
    deleteProduct: async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const userId = req.user!.id;
        const deletedProduct = await productService.deleteProduct(id, userId);

        return res.status(200).json({
            success: true,
            message: "Product Deleted",
            data: {
                product: deletedProduct,
            },
        });           
    },
}

export default productController;