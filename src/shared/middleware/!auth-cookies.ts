import { Request, Response, NextFunction } from "express";
import AppError from "../error/AppError.js";
import jwt from "jsonwebtoken";
import authService from "../../modules/auth/auth.service.js";

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export default async function authMiddleware (req: AuthRequest, res: Response, next: NextFunction) {
    // 1. Get Access Token
    const accessToken = req.cookies.accessToken;

    // If There's no Access Token
    if (!accessToken) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    // If there's an Access Token
    try {
        // 2. Verify JWT
        const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as { userId: string };
        // 3. Set User ID to req.user.id
        req.user = {
            id: payload.userId,
        }
        // 4. Proceed
        return next();
    } catch (error) {
        // If Error is Not JWT Token Expired
        if (!(error instanceof jwt.TokenExpiredError)) {
            throw new AppError("Unauthorized", 401, "INVALID_TOKEN");
        }
    }
    // If Error JWT Token Expired
    // 1. Get Refresh Token
    const refreshToken = req.cookies.refreshToken;

    // If There's no Refresh Token
    if (!refreshToken) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    // 2. Call Auth Refresh Service
    const result = await authService.refresh(refreshToken);

    // If Session Not Found or Expired
    if (!result) {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");

        throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    res.cookie("refreshToken", result?.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.cookie("accessToken", result?.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    req.user = {
        id: result.userId,
    }

    return next();
}

