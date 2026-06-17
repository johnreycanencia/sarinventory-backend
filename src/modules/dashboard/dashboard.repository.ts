import prisma from "../../lib/prisma.js";

const dashboardRepository = {
    getTransactionsAndPaymentsTotal: async (userId: string, dateFilter: { gte: Date, lte: Date } | undefined) => {
        const transactions = await prisma.transaction.groupBy({
            by: ["type"],
            where: { 
                userId,
                ...(dateFilter && {
                    createdAt: {
                        gte: dateFilter.gte,
                        lte: dateFilter.lte,
                    }
                }),
            },
            _sum: {
                totalRevenue: true,
                totalCost: true,
                totalProfit: true,
                creditFee: true,
            }
        })
        const payments = await prisma.customerPayment.aggregate({
            where: { 
                userId,
                ...(dateFilter && {
                    createdAt: {
                        gte: dateFilter.gte,
                        lte: dateFilter.lte,
                    }
                }),                
            },
            _sum: {
                amount: true,
            }
        })
        const products = await prisma.product.findMany({
            where: { userId },
            select: {
                // name: true, - TODO - use for displaying names of out of stock items in future feature.
                stock: true,
                costPrice: true,
                sellingPrice: true,
            }
        })
        const transactionCount = await prisma.transaction.count({
            where: {
                userId,
                type: {
                    in: ["SALE", "CREDIT"]
                },
                ...(dateFilter && {
                    createdAt: {
                        gte: dateFilter.gte,
                        lte: dateFilter.lte,
                    }
                })
            }
        })
        const totalItemsSold = await prisma.transactionItem.aggregate({
            where: {
                transaction: {
                    userId,
                    type: {
                        in: ["SALE", "CREDIT"]
                    },
                    ...(dateFilter && {
                        createdAt: {
                            gte: dateFilter.gte,
                            lte: dateFilter.lte,
                        }
                    })
                }
            },
            _sum: {
                quantity: true,
            }
        })
        return { transactions, payments, products, transactionCount, totalItemsSold }
    }
}

export default dashboardRepository;