import { Response } from "express";
import userService from "./user.service.js";
import { AuthRequest } from "../../shared/middleware/verifyJWT.js";

const userController = {
    getUser: async (req: AuthRequest, res: Response) => {
        const userId = req.user!.id;
        const user = await userService.getUser(userId);

        return res.status(200).json({
            success: true,
            message: "User Retrieved",
            data: {
                username: user?.username,
            }
        });
    },
}

export default userController;