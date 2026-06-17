import { Request, Response } from "express";
import categoryService from "./categories.service.js";

const categoryController = {
    getCategories: async (req: Request, res: Response) => {
        const categories = await categoryService.getCategories();

        return res.status(200).json({
            success: true,
            message: "Categories Retrieved",
            data: {
                categories,
            }
        });
    },
}

export default categoryController;