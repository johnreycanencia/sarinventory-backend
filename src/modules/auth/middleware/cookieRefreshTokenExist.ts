import { Request, Response, NextFunction } from "express";
import AppError from "../../../shared/error/AppError.js";

export default function cookieRefreshTokenExist(req: Request, res: Response, next: NextFunction) {
    
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError("Refresh token missing", 401, "REFRESH_TOKEN_MISSING");
    }

    next();
}