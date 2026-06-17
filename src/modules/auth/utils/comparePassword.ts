import bcrypt from "bcryptjs";

export default async function comparePassword (data: string, hashData: string) {

    const result = bcrypt.compare(data, hashData);

    return result;
}