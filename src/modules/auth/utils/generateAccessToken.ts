import jwt from "jsonwebtoken";

export default function generateAccessToken(uid: string) {

    const payload = {
        userId: uid,
    }
    const SECRET_KEY = process.env.JWT_ACCESS_SECRET;

    if (!SECRET_KEY) {
        throw new Error("JWT_ACCESS_SECRET is not defined in the environment variables.");
    }

    const accessToken = jwt.sign(
        payload,
        SECRET_KEY,
        {
            algorithm: "HS256",
            expiresIn: "15min"
        }
    )

    return accessToken;
}