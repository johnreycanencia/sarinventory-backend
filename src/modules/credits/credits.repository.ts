import prisma from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";
const creditRepository = {
    customers: (userId: string) => {
        return prisma.customer.findMany({
            where: { userId },
            orderBy: { lastActivityAt: "desc" },
            select: {
                id: true,
                name: true,
                transactions: {
                    where: { // where or some?
                        type: "CREDIT",
                        creditStatus: { not: "PAID" },
                    },
                    select: {
                        remainingBalance: true,
                    }
                }
            },
        })
    },
    customerCredits: (customerId: string) => {
        // This returns all paid, partial, and unpaid records. TODO - Separation.
        return prisma.transaction.findMany({
            where: {
                customerId,
                type: "CREDIT",
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                createdAt: true,
                totalRevenue: true, // totalRevenue + creditFee = total balance
                creditFee: true,
                remainingBalance: true,
                creditStatus: true,
                notes: true,
            }
        })
    },
    unpaidCredits: (customerId: string) => {
        return prisma.transaction.findMany({
            where: {
                customerId,
                type: "CREDIT",
                remainingBalance: {
                    gt: 0,
                },
                creditStatus: {
                    not: "PAID",
                }
            },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                remainingBalance: true,
                creditStatus: true,
                createdAt: true,
            }
        })
    },
    payment: (tx: Prisma.TransactionClient, data: Prisma.CustomerPaymentUncheckedCreateInput) => {
        return tx.customerPayment.create({
            data,
        })
    },
    allocate: (tx: Prisma.TransactionClient, data: Prisma.PaymentAllocationUncheckedCreateInput) => {
        return tx.paymentAllocation.create({
            data: { 
                ...data, 
                createdAt: new Date(),
            }
        })
    },
    updateBalance: (tx: Prisma.TransactionClient, transactionId: string, newBalance: number) => {
        return tx.transaction.update({
            where: { id: transactionId },
            data: {
                remainingBalance: newBalance,
                creditStatus: newBalance === 0 ? "PAID" : "PARTIAL",
            }
        })
    },
    paymentHistory: (customerId: string) => {
        return prisma.customerPayment.findMany({
            where: { customerId },
            orderBy: { createdAt: "desc" },
            // select, id, createdAt, notes, amount, method
            select: {
                id: true,
                createdAt: true,
                amount: true,
                method: true,
                notes: true,
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

export default creditRepository;