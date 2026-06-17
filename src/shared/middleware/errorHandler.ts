import { NextFunction, Request, Response } from "express";
import AppError from "../error/AppError.js";

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    
    console.error(error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: {
                message: error.message,
                code: error.errorCode,
            },
        });
    }

    return res.status(500).json({
        success: false,
        error: {
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR",
        },
    });
};

export default errorHandler;