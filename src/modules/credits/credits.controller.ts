import { Request, Response } from "express";
import { AuthRequest } from "../../shared/middleware/verifyJWT.js";
import creditService from "./credits.service.js";

const creditController = {
    customers: async (req: AuthRequest, res: Response) => {
        const userId = req.user!.id;
        const customers = await creditService.customers(userId);

        return res.status(200).json({
            success: true,
            message: "Customer Credits Overview",
            data: {
                customers,
            },
        });
    },
    customerCredits: async (req: Request, res: Response) => {
        const { customerId } = req.body;
        const { unpaid, paid, paymentHistory } = await creditService.customerCredits(customerId);

        return res.status(200).json({
            success: true,
            message: "Customer Credits Detail",
            data: {
                unpaid,
                paid,
                paymentHistory,
            },
        });
    },
    payment: async (req: AuthRequest, res: Response) => {
        const paymentData = req.body;
        const userId = req.user!.id;
        const payment = await creditService.payment(paymentData, userId);

        return res.status(201).json({
            success: true,
            message: "Payment Recorded Successfully",
            data: {
                payment,
            },
        });
    }
}

export default creditController;