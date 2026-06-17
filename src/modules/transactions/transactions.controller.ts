import { Request, Response } from "express";
import { AuthRequest } from "../../shared/middleware/verifyJWT.js";
import transactionService from "./transactions.service.js";

const transactionController = {
    transaction: async (req: AuthRequest, res: Response) => {
        const transactionData = req.body;
        const userId = req.user!.id;
        const transaction = await transactionService.transaction(transactionData, userId);

        return res.status(201).json({
            success: true,
            message: "Transaction Successful",
            data: {
                transaction,
            },
        });
    },
    transactionHistory: async (req: AuthRequest, res: Response) => {
        const userId = req.user!.id;
        const transactionHistory = await transactionService.transactionHistory(userId);

        return res.status(200).json({
            success: true,
            message: "Transaction History",
            data: {
                transactionHistory,
            },
        });
    },
    transactionItems: async (req: Request, res: Response) => {
        const transactionId = req.query.id;
        const transactionItems = await transactionService.transactionItems(transactionId as string);

        return res.status(200).json({
            success: true,
            message: "Transaction Items",
            data: {
                transactionItems,
            },
        });
    }
}

export default transactionController;