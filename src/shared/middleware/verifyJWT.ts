import { Request, Response, NextFunction } from "express";
import AppError from "../error/AppError.js";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export default function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    // Get Access Token from Cookie
    const accessToken = req.cookies.accessToken;

    // 1. No token → unauthorized
    if (!accessToken) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        // 2. Verify token
        const payload = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET!
        ) as { userId: string };

        // 3. Attach user
        req.user = {
            id: payload.userId,
        };

        return next();
    } catch (error) {
        // 4. Any error = invalid/expired → frontend handles refresh
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
}