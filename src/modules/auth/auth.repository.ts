import prisma from "../../lib/prisma.js";
import { 
    CreateUserInput,
    SaveRefreshTokenInput
} from './auth.schema.js';

const authRepository = {
    createUser: (data: CreateUserInput) => {
        return prisma.user.create({
            data: {
                username: data.username,
                hashedPassword: data.hashedPassword,
                email: data.email
            }
        });
    },
    checkIfExistLogin: (identifier: string) => {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { username: identifier },
                    { email: identifier },
                ]
            }
        })
    },
    checkIfExistRegister: ({ username, email }: { username: string, email: string | null }) => {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                ]
            }
        })
    },
    saveRefreshToken: (data: SaveRefreshTokenInput) => {
        return prisma.refreshToken.create({
            data,
        })
    },
    getRefreshToken: (hashedRefreshToken: string) => {
        return prisma.refreshToken.findUnique({
            where: { hashedRefreshToken },
        });
    },
    deleteRefreshToken: (hashedRefreshToken: string) => {
        return prisma.refreshToken.deleteMany({
            where: { hashedRefreshToken },
        })
    }
}

export default authRepository;