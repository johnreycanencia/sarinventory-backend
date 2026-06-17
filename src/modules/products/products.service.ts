import AppError from "../../shared/error/AppError.js";
import NotFoundError from "../../shared/error/NotFoundError.js";
import productRepository from "./products.repository.js";
import { 
    CreateProductInput,
    UpdateProductInput,
} from './products.schema.js';

import { Prisma } from "@prisma/client";

const productService = {
    insertProduct: async (data: CreateProductInput) => {
        return await productRepository.insert(data);
    },
    getProducts: async (userId: string) => {
        return await productRepository.getProducts(userId);
    },
    getProductById: async (id: string, userId: string) => {
        const product = await productRepository.getById(id, userId);
        if (!product) {
            throw new NotFoundError("Product Not Found");
        }
        return product;
    },
    updateProduct: async (id: string, data: UpdateProductInput, userId: string) => {
        const updatedProduct = await productRepository.update(id, data, userId);
        if (!updatedProduct) {
            throw new NotFoundError("Product Not Found");
        }
        return updatedProduct;
    },
    deleteProduct: async (id: string, userId: string) => {
        try {
            const deletedProduct = await productRepository.delete(id, userId);
            return deletedProduct;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFoundError("Product Not Found");
                }
            }
            throw error;
        }
    },
}

export default productService;