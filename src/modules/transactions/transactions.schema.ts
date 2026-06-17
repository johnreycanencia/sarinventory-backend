import { z } from 'zod';
import { Prisma } from "@prisma/client";

export const ItemSchema =  z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
});

export const TransactionSchema = z.object({
    transactionType: z.enum ([
        "SALE",
        "CREDIT",
        "CONSUMPTION",
        "LOSS",
    ]),
    customerName: z.string().trim().optional(),
    creditFee: z.number().nonnegative().default(0).optional(),
    items: z.array(ItemSchema).min(1),
    notes: z.string().trim().optional(),
});

export interface TransactionItem {
    transactionId?: string;
    productId: string;
    productName: string;
    costEach: Prisma.Decimal;
    priceEach: Prisma.Decimal;
    quantity: number;
    totalRevenue: Prisma.Decimal;
    totalCost: Prisma.Decimal;
    totalProfit: Prisma.Decimal;
}

export type Item = z.infer<typeof ItemSchema>;
export type TransactionInput = z.infer<typeof TransactionSchema>;