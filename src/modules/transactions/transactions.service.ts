import { TransactionInput, TransactionItem } from "./transactions.schema.js";
import transactionRepository from "./transactions.repository.js";
import NotFoundError from "../../shared/error/NotFoundError.js";
import { Prisma, CreditStatus } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import AppError from "../../shared/error/AppError.js";

const transactionService = {
    transaction: async (data: TransactionInput, userId: string) => {
        const { transactionType, customerName, creditFee, items, notes } = data; // Zod automatically validates? with parse? with what return?
        // check if type and items exist and not null or empty
        // check if transaction type is valid
        // check if credit has a customer name
        if (transactionType === "CREDIT" && !customerName) {
            throw new AppError("Customer name is required for credit transactions", 400, "CUSTOMER_REQUIRED");
        }
        // fetch all the products where id = items
        const productIds = items.map(item => item.productId);
        const products = await transactionRepository.getSelectedProducts(productIds);
        // check if all product is available
        if (products.length !== productIds.length) {
            throw new NotFoundError("One or more products doesn't exist");
        }        
        // calculate total
        let transactionTotalRevenue = new Prisma.Decimal(0);
        let transactionTotalCost = new Prisma.Decimal(0);
        let transactionTotalProfit = new Prisma.Decimal(0);
        const transactionItems: TransactionItem[] = [];
        // product map
        const productsMap = new Map(
            products.map(product => [product.id, product])
        );
        // items loop
        for (const item of items) {
            // get product data by item product id
            const product = productsMap.get(item.productId);
            if (!product) {
                throw new NotFoundError("Product not found");
            }
            // check if there's enough stock
            if (item.quantity > product.stock) {
                // Bad Request Error
                throw new AppError(`Insufficient stock for ${product.name}`, 409, "INSUFFICIENT_STOCK")
            }
            // calculate total
            let itemTotalRevenue = new Prisma.Decimal(0);
            let itemTotalCost = new Prisma.Decimal(0);
            let itemTotalProfit = new Prisma.Decimal(0);

            if (transactionType === "LOSS" || transactionType === "CONSUMPTION") {
                // LOSS or CONSUMPTION
                itemTotalRevenue = itemTotalRevenue.add(0);
                transactionTotalRevenue = transactionTotalRevenue.plus(itemTotalRevenue);
                // calculate total cost
                itemTotalCost = product.costPrice.mul(item.quantity);
                transactionTotalCost = transactionTotalCost.plus(itemTotalCost);
                // calculate total profit
                itemTotalProfit = itemTotalRevenue.minus(itemTotalCost);
                transactionTotalProfit = transactionTotalProfit.plus(itemTotalProfit);
            } else {
                // SALES or CREDIT
                itemTotalRevenue = product.sellingPrice.mul(item.quantity); // mul = multiply
                transactionTotalRevenue = transactionTotalRevenue.plus(itemTotalRevenue);
                // calculate total cost
                itemTotalCost = product.costPrice.mul(item.quantity);
                transactionTotalCost = transactionTotalCost.plus(itemTotalCost);
                // calculate total profit
                itemTotalProfit = itemTotalRevenue.minus(itemTotalCost);
                transactionTotalProfit = transactionTotalProfit.plus(itemTotalProfit);
            }
            // push data to array
            transactionItems.push({
                productId: product.id,
                productName: product.name,
                costEach: product.costPrice,
                priceEach: product.sellingPrice,
                quantity: item.quantity,
                totalRevenue: itemTotalRevenue,
                totalCost: itemTotalCost,
                totalProfit: itemTotalProfit,
            });
        }
        // check if customer exist, if not create a customer
        let customerId = null;
        if (customerName) {
            const name = customerName.toLocaleLowerCase().trim();
            let customer = await transactionRepository.findCustomer(name, userId);
            if (!customer) {
                customer = await transactionRepository.createCustomer(name, userId);
            }
            customerId = customer.id;
        }
        const transactionData = {
            type: transactionType,
            userId: userId,
            customerId: customerId,
            totalRevenue: transactionTotalRevenue,
            totalCost: transactionTotalCost,
            totalProfit: transactionTotalProfit,
            notes: notes,
            creditFee: transactionType === "CREDIT" ? creditFee : 0,
            remainingBalance: transactionType === "CREDIT" ? transactionTotalRevenue.plus(creditFee ?? 0) : null,
            creditStatus: transactionType === "CREDIT" ? CreditStatus.UNPAID : null,
        }
        // Transactions
        const result = await prisma.$transaction(async (tx) => {
            // Create Transaction
            const transaction = await transactionRepository.createTransaction(tx, transactionData);
            // Create Transaction Items
            const updatedTransactionItems: Prisma.TransactionItemCreateManyInput[]  = transactionItems.map(item => ({
                ...item,
                transactionId: transaction.id,
            }));
            await transactionRepository.createItems(tx, updatedTransactionItems);
            // Update Stock
            await transactionRepository.decrementStock(tx, items);
            // Update Customer Activity
            if (transactionType === "CREDIT" && customerId) {
                await transactionRepository.updateCustomerLastActivity(tx, customerId);
            }
            // Other Future Operations

            return transaction;
        });
        return result;
    },
    transactionHistory: async(userId: string) => {
        const transactionHistory = await transactionRepository.transactionHistory(userId);
        return transactionHistory;
    },
    transactionItems: async(transactionId: string) => {
        const transactionItems = await transactionRepository.transactionItems(transactionId);
        return transactionItems;
    },
}

export default transactionService;