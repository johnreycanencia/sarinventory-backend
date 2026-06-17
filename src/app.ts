import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet"
// 
import errorHandler from "./shared/middleware/errorHandler.js";
// router imports
import productRouter from "./modules/products/products.routes.js";
import categoryRouter from "./modules/categories/categories.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import transactionRouter from "./modules/transactions/transactions.routes.js";
import creditRouter from "./modules/credits/credits.routes.js";
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";
import userRouter from "./modules/user/user.routes.js";

const app = express();

// Config
app.set('trust proxy', 1);

// security
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://sarinventory.vercel.app").split(",");
const corsOptions: cors.CorsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}
app.use(cors(corsOptions));

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    message: "Too many requests",
    standardHeaders: "draft-8",
    legacyHeaders: false,
});
app.use(limiter);

// middleware
app.use(express.json({ limit: '100kb' })); // Rejects anything over 100 kilobytes payload
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
app.use(cookieParser());

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    port: process.env.PORT,
  });
});

// routes
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/credits", creditRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/user", userRouter);

// error middleware - must be last
app.use(errorHandler);

export default app;