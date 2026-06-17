import prisma from "../../lib/prisma.js";
import { Item } from "./transactions.schema.js";
import { Prisma } from "@prisma/client";

const transactionRepository = {
    getSelectedProducts: (productIds: string[]) => {
        return prisma.product.findMany({
            where: {
                id: { in: productIds },
            }
        })
    },
    createTransaction: (tx: Prisma.TransactionClient, data: Prisma.TransactionUncheckedCreateInput) => { // TODO: Update Prisma on Products & Auth
        return tx.transaction.create({ 
            data,
            select: {
                id: true,
                type: true,
                customerId: true,
                totalRevenue: true,
                totalCost: true,
                totalProfit: true,
                createdAt: true,
            }
        });
    },
    createItems: (tx: Prisma.TransactionClient, data:  Prisma.TransactionItemCreateManyInput[]) => { // Reminder: Zod only for Input Validation
        return tx.transactionItem.createMany({ data });
    },
    decrementStock: async (tx: Prisma.TransactionClient, data: Item[]) => {
        for (const item of data) {
            await tx.product.update({
                where: { id: item.productId },
                data: { 
                    stock: { decrement: item.quantity },
                }
            })
        }
    },
    findCustomer: (customerName: string, userId: string) => {
        return prisma.customer.findFirst({
            where: {
                userId,
                name: customerName,
            }
        })
    },
    createCustomer: (customerName: string, userId: string) => {
        return prisma.customer.create({
            data: {
                userId,
                name: customerName,
            }
        })
    },
    transactionHistory: (userId: string) => {
        return prisma.transaction.findMany({
            where: { userId },
            select: {
                id: true,
                type: true,
                totalRevenue: true,
                totalCost: true,
                totalProfit: true,
                createdAt: true,
                customer: true,
                notes: true,
                creditFee: true,
            },
            orderBy: { createdAt: "desc" },
        })
    },
    transactionItems: (transactionId: string) => {
        return prisma.transactionItem.findMany({
            where: { transactionId },
            select: {
                productName: true,
                priceEach: true,
                quantity: true,
                totalRevenue: true,
            }
        })
    },
    updateCustomerLastActivity: (tx: Prisma.TransactionClient, customerId: string) => {
        return tx.customer.update({
            where: { id: customerId },
            data: {
                lastActivityAt: new Date(),
            }
        })
    }
}

export default transactionRepository;