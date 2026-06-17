    class AppError extends Error {
        public readonly statusCode: number;
        public readonly errorCode: string;

        constructor(message: string, statusCode: number, errorCode: string) {
            super(message);
            this.statusCode = statusCode;
            this.errorCode = errorCode;

            // Set the prototype explicitly (required when extending built-in classes in TS)
            Object.setPrototypeOf(this, AppError.prototype);

            // Maintains proper stack trace for where our error was thrown (only available on V8)
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, AppError);
            }
        }
    }

    export default AppError;