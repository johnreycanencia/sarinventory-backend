import { z } from 'zod';

// Schema

export const ProductIdSchema = z.uuid();

export const CreateProductSchema = z.object({
    userId: z.
        string(),

    name: z
        .string()
        .min(1, "Name is required")
        .max(100),

    costPrice: z
        .coerce
        .number()
        .positive(),

    sellingPrice: z
        .coerce
        .number()
        .positive(),

    stock: z.coerce.number()
        .int()
        .nonnegative()
        .default(0),

    imageUrl: z
        .url()
        .optional(),

    categoryId: z
        .uuid()
        .optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductParamsSchema = z.object({
    id: z.uuid()
});

// Types

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export type ProductParamsInput = z.infer<typeof ProductParamsSchema>;