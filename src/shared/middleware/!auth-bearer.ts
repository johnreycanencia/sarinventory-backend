import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../error/AppError.js";

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

// Use when JWT is sent using authorization
// NOTE: currently storing both tokens on cookie

export default function authenticate (req: AuthRequest, res: Response, next: NextFunction) {

    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const accessToken = authorization.split(" ")[1];

    try {
        const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as { userId: string };
        req.user = {
            id: payload.userId,
        }
        next();
    } catch (error) {
        throw new AppError("Unauthorized", 401, "INVALID_TOKEN");
    }
}