import { randomUUID } from 'crypto';

import authRepository from './auth.repository.js';

import {
    RegisterInput,
    LoginInput
} from './auth.schema.js'

import hashPassword from './utils/hashPassword.js';
import generateAccessToken from './utils/generateAccessToken.js';
import generateRefreshToken from './utils/generateRefreshToken.js';
import AppError from '../../shared/error/AppError.js';
import comparePassword from './utils/comparePassword.js';
import hashRefreshToken from './utils/hashRefreshToken.js';

import { Prisma } from "@prisma/client";

const authService = {
    register: async ({ username, password, email }: RegisterInput) => {
        // 1. Check if Username or Email Already Exist
        const userExist = await authRepository.checkIfExistRegister({username, email});
        if (userExist) {
            throw new AppError("User Already Exist", 409, "USER_ALREADY_EXIST");
        }
        // 2. Hash Password
        const hashedPassword = await hashPassword(password);
        // 3. Store Username, Email, Hashed Password
        const newUser = await authRepository.createUser({ username, hashedPassword, email });
        // 4. Generate Access and Refresth Token
        const accessToken = generateAccessToken(newUser.id);
        const { refreshToken, hashedRefreshToken } = generateRefreshToken();
        const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
        // const THREE_MINUTES_MS = 3 * 60 * 1000;
        const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS);
        const deviceId = randomUUID();
        await authRepository.saveRefreshToken({
            userId: newUser.id,
            hashedRefreshToken,
            deviceId,
            expiresAt,
        });
        // 6. Return Access and Refresh Token
        return { 
            accessToken, 
            refreshToken,
            username: newUser.username,
            email: newUser.email,
        }
    },
    login: async ({ identifier, password }: LoginInput) => {
        // 1. Check if Username or Email Already Exist
        const user = await authRepository.checkIfExistLogin(identifier);
        if (!user) {
            throw new AppError("User Doesn't Exist", 409, "USER_NOT_EXIST");
        }
        // 2. Compare Password
        const passwordMatch = await comparePassword(password, user.hashedPassword);
        if (!passwordMatch) {
            throw new AppError("Invalid email or password", 401, "INVALID_INPUT");
        }
        // 3. Generate Access and Refresh Token
        const accessToken = generateAccessToken(user.id);
        const { refreshToken, hashedRefreshToken } = generateRefreshToken();
        // 4. Create New Refresh Token Record
        const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
        // const THREE_MINUTES_MS = 3 * 60 * 1000; = 3 * 60 * 1000;
        const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS);
        const deviceId = randomUUID();
        await authRepository.saveRefreshToken({
            userId: user.id,
            hashedRefreshToken,
            deviceId,
            expiresAt,
        });
        // 5. Return Access Token, Refresh Token, Username, Email
        return { 
            accessToken, 
            refreshToken,
            username: user.username,
            email: user.email,
        }
    },
    refresh: async (refreshTokenInput: string) => {
        // 1. Hash Refresh Token Input
        const hashedRefreshInput = hashRefreshToken(refreshTokenInput);
        // 2. Find Session in DB
        const session = await authRepository.getRefreshToken(hashedRefreshInput);
        if (!session) { // Invalid or Reuse Refresh Token
            return null;
        }
        // 3. Check Session Expiration
        if (session.expiresAt < new Date()) {
            await authRepository.deleteRefreshToken(session.hashedRefreshToken);
            return null;
        }
        // 4. Generate Access and Refresh Token
        const accessToken = generateAccessToken(session.userId);
        const { refreshToken, hashedRefreshToken } = generateRefreshToken();
        // 5. Create New Refresh Token Record
        const deviceId = randomUUID();
        const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
        // const THREE_MINUTES_MS = 3 * 60 * 1000;
        const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS);
        await authRepository.saveRefreshToken({
            userId: session.userId,
            hashedRefreshToken,
            deviceId,
            expiresAt,
        });
        // 6. Delete Old Refresh Token Record
        await authRepository.deleteRefreshToken(session.hashedRefreshToken);
        // 7. Return Access and Refresh Token
        return {
            userId: session.userId,
            accessToken,
            refreshToken,
        }
    },
    logout: async (refreshTokenInput: string) => {
        // 1. Hash Refresh Token Input
        const hashedRefreshInput = hashRefreshToken(refreshTokenInput);
        // 2. Delete Refresh Token Record
        await authRepository.deleteRefreshToken(hashedRefreshInput);
    }
}

export default authService;