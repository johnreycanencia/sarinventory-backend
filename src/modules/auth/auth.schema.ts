import { z } from 'zod';

// Schema

export const RegisterSchema = z.object({
  username: z.string().trim().toLowerCase(),
  password: z.string().min(6),
  email: z.string().email().toLowerCase(),
});

export const CreateUserSchema = z.object({
  username: z.string().toLowerCase(),
  hashedPassword: z.string().min(6),
  email: z.string().email().toLowerCase(),
});

export const SaveRefreshTokenSchema = z.object({
  hashedRefreshToken: z.string(),
  userId: z.string(),
  deviceId: z.string(),
  expiresAt: z.coerce.date(),
});

export const LoginSchema = z.object({
  identifier: z.string().trim().toLowerCase(),
  password: z.string(),
});

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(4, 'Username must be at least 4 characters long')
  .max(20, 'Username cannot exceed 20 characters')
  .regex(/^[a-zA-Z0-9._*-]+$/, 'Username can only contain letters, numbers, and [ . _ - * ]')
  .refine(val => !val.includes('@'), { message: 'Username cannot contain @' });

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Please enter a valid email address')
  .optional();

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password is too long');

export const SignupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Types

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type SaveRefreshTokenInput = z.infer<typeof SaveRefreshTokenSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;