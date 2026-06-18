import { Request, Response, NextFunction } from "express";
import AppError from "../../../shared/error/AppError.js";
import { LoginSchema } from "../auth.schema.js";
import { z } from "zod";

export default function loginInputValidator(req: Request, res: Response, next: NextFunction) {
    try {
        const validatedData = LoginSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessage = error.issues[0].message;
            throw new AppError(errorMessage, 400, "INVALID_INPUT");
        }
        throw error;
    }
}