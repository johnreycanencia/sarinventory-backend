import { Request, Response } from "express";
import { AuthRequest } from "../../shared/middleware/verifyJWT.js";
import dashboardService from "./dashboard.service.js";

const dashboardController = {
    financialSummary: async (req: AuthRequest, res: Response) => {
        const userId = req.user!.id;
        // /dashboard/api/overview?period=today
        // /dashboard/api/overview?period=week
        // /dashboard/api/overview?period=month
        // /dashboard/api/overview?period=all
        // /dashboard/api/overview?period=custom&startDate0000-00-00&endDate0000-00-00
        const { period, startDate, endDate } = req.query;
        const summary = await dashboardService.financialSummary(
            userId,
            period as string,
            startDate as string | undefined,
            endDate as string | undefined,
        );

        return res.status(200).json({
            success: true,
            message: "Financial Summary",
            data: {
                summary,
            },
        });
    }
}

export default dashboardController