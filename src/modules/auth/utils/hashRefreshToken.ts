import crypto from "crypto";

export default function hashRefreshToken (refreshToken: string) {

    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    return hashedRefreshToken;
}