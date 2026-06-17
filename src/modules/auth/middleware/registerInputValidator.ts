import { Request, Response, NextFunction } from "express";
import AppError from "../../../shared/error/AppError.js";
import { SignupSchema } from "../auth.schema.js";
import { z } from "zod";

export default function registerInputValidator(req: Request, res: Response, next: NextFunction) {
    try {
        SignupSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessage = error.issues[0].message;
            throw new AppError(errorMessage, 400, "INVALID_INPUT");
        }
        throw error;
    }
}