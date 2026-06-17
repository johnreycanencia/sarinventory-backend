import prisma from "../../lib/prisma.js";
import { 
    CreateProductInput,
    UpdateProductInput,
} from './products.schema.js';

const productRepository = {
    insert: (data: CreateProductInput) => {
        return prisma.product.create({
            data, 
            include: { category: true },
        });
    },
    getProducts: (userId: string) => {
        return prisma.product.findMany({
            where: { userId },
            // Exclude userId
            select: {
                id: true,
                name: true,
                costPrice: true,
                sellingPrice: true,
                stock: true,
                imageUrl: true,
                category: true,
                categoryId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },
    getById: (id: string, userId: string) => {
        return prisma.product.findFirst({
            where: { id, userId },
            select: {
                id: true,
                name: true,
                costPrice: true,
                sellingPrice: true,
                stock: true,
                imageUrl: true,
                category: true,
                categoryId: true,
                createdAt: true,
                updatedAt: true,
            },            
        });
    },
    update: (id: string, data: UpdateProductInput, userId: string) => {
        return prisma.product.update({
            where: { id, userId },
            data,
        });
    },
    delete: (id: string, userId: string) => {
        return prisma.product.delete({
            where: { id, userId },
        });
    },
}

export default productRepository;