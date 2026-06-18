import { da } from "zod/locales";
import AppError from "../../shared/error/AppError.js";
import dashboardRepository from "./dashboard.repository.js";

const dashboardService = {
    financialSummary: async (userId: string, period: string | undefined, startDate: string | undefined, endDate: string | undefined) => {
        //
        let dateFilter;
        const now = new Date();

        switch (period) {
            case "today": {
                const start = new Date(now);;
                start.setHours(0, 0, 0, 0);

                dateFilter = { 
                    gte: start, 
                    lte: now,
                };

                break;
            }
            case "week": {
                const start = new Date(now);
                start.setDate(now.getDate() - now.getDay());
                start.setHours(0, 0, 0, 0);

                dateFilter = { 
                    gte: start,
                    lte: now 
                };

                break;
            }
            case "month": {
                const start = new Date(now.getFullYear(), now.getMonth(), 1);

                dateFilter = {
                    gte: start,
                    lte: now,
                }

                break;
            }
            case "custom": {
                if (!startDate || !endDate) {
                    throw new AppError("Start date and end date are required", 400, "DATES_REQUIRED");
                }
                // TODO: Check if start date is later than the end date
                const start = new Date(startDate);
                start.setHours(0, 0, 0,0 )
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                dateFilter = {
                    gte: start,
                    lte: end,
                }

                break;
            }
            case "all":
            default:
                dateFilter = undefined;
        }
        // Fetch Transactions, Payments, Prodcuts, transaction count, total items sold
        const { transactions, payments, products, transactionCount, totalItemsSold } = await dashboardRepository.getTransactionsAndPaymentsTotal(userId, dateFilter);
        // Create a Transaction Map
        const transactionsMap = new Map(transactions.map(summary => [summary.type, summary._sum]));
        // Sales Data
        const sale = transactionsMap.get("SALE");
        
        const cashSales = Number(sale?.totalRevenue ?? 0);
        const cashProfit = Number(sale?.totalProfit ?? 0);
        const cashMargin = cashSales === 0 ? 0 : (Number((cashProfit / cashSales) * 100)).toFixed(2);
        // Loss Data
        const consumption = transactionsMap.get("CONSUMPTION");
        const loss = transactionsMap.get("LOSS");

        const consumptions = Number(consumption?.totalCost ?? 0);
        const losses = Number(loss?.totalCost ?? 0);
        const totalLoss = consumptions + losses;
        // Credits Data
        const credit = transactionsMap.get("CREDIT");

        const creditSales = Number(credit?.totalRevenue ?? 0);
        const creditProfit = Number(credit?.totalProfit ?? 0);
        const creditFeesCharge = Number(credit?.creditFee ?? 0);
        // Payment Data
        const totalPayments = Number(payments._sum.amount ?? 0);
        // Combined
        const combinedSales = cashSales + creditSales;
        const combinedProfit = cashProfit + creditProfit;
        const totalEarnedProfit = (cashProfit + creditProfit + creditFeesCharge) - totalLoss;
        // Others
        const netCashProfit = cashProfit - totalLoss;
        // Products
        const totalProducts = products.length;
        const totalItems = products.reduce((sum, product) => sum + product.stock, 0);
        const inventoryCostValue = products.reduce((sum, product) => sum + (Number(product.costPrice) * product.stock), 0);
        const inventorySellingValue = products.reduce((sum, product) => sum + (Number(product.sellingPrice) * product.stock), 0);
        const potentialProfit = inventorySellingValue - inventoryCostValue;
        const potentialMargin = inventorySellingValue === 0 ? 0 : Number((potentialProfit / inventorySellingValue) * 100).toFixed(2);
        const outOfStockProducts = products.filter(product => product.stock === 0).length;
        const lowStockProducts = products.filter(product => product.stock < 5 && product.stock > 0).length;

        // Summary
        const financialSummary = {
            cash: {
                sales: cashSales,
                profit: cashProfit,
                margin: cashMargin,
                net: netCashProfit,
            },
            loss: {
                consumption: -consumptions,
                loss: -losses,
                total: -totalLoss,
            },
            credit: {
                sales: creditSales,
                profit: creditProfit,
                fees: creditFeesCharge,
                payments: totalPayments,
            },
            combined: {
                sales: combinedSales,
                profit: combinedProfit,
                total: totalEarnedProfit,
            },
            date: {
                period,
                startDate,
                endDate,
            },
            inventory: {
                totalProducts,
                totalItems,
                inventoryCostValue,
                inventorySellingValue,
                potentialProfit,
                potentialMargin,
                outOfStockProducts,
                lowStockProducts,
            },
            transactionCount,
            totalItemsSold: totalItemsSold._sum.quantity,
        }
        return financialSummary;
    }
}

export default dashboardService;