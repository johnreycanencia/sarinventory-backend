import AppError from "./AppError.js";

class NotFoundError extends AppError {
    constructor(message = "Resource Not Found") {
        super(message, 404, "NOT_FOUND");
    }
}

export default NotFoundError;