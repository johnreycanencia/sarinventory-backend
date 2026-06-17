import bcrypt from "bcryptjs";

export default async function hashPassword (data: string) {
    const saltRounds = 10;

    const hashedData = await bcrypt.hash(data, saltRounds);

    return hashedData;
}