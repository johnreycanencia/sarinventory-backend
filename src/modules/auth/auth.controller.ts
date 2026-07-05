import { Request, Response } from "express";
import authService from "./auth.service.js";

const authController = {
    register: async (req: Request, res: Response) => {
        const { username, password, email } = req.body;
        const { accessToken, refreshToken, username: usn, email: umail } = await authService.register({ username, password, email });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: process.env.NODE_ENV === "development" ? undefined : ".sarinventory.com",
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: process.env.NODE_ENV === "development" ? undefined : ".sarinventory.com",
        });

        return res.status(201).json({
            success: true,
            message: "Registered Successfully",
            data: {
                // accessToken,
                user: {
                    username: usn,
                    email: umail,
                }
            },
        });
    },
    login: async (req: Request, res: Response) => {
        const { identifier, password } = req.body;
        const { accessToken, refreshToken, username, email } = await authService.login({ identifier, password });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: process.env.NODE_ENV === "development" ? undefined : ".sarinventory.com",
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: process.env.NODE_ENV === "development" ? undefined : ".sarinventory.com",
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                // accessToken,
                user: {
                    username,
                    email,
                }
            },
        });
    },
    refresh: async (req: Request, res: Response) => {
        const refreshTokenInput = req.cookies.refreshToken;
        
        const tokens = await authService.refresh(refreshTokenInput);

        // If Session Not Found or Expired
        if (!tokens) {
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");

            return res.status(401).json({
                success: false,
                message: "Session expired"
            })
        }

        res.cookie("refreshToken", tokens?.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: process.env.NODE_ENV === "development" ? undefined : ".sarinventory.com",
        });

        res.cookie("accessToken", tokens?.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: process.env.NODE_ENV === "development" ? undefined : ".sarinventory.com",
        });

        return res.status(200).json({
            success: true,
            message: "Refresh successful",
            // data: {
            //     accessToken: tokens.accessToken,
            // },
        });
    },
    logout: async (req: Request, res: Response) => {
        const refreshTokenInput = req.cookies.refreshToken;
        await authService.logout(refreshTokenInput);

        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        }); 
    }
}

export default authController;