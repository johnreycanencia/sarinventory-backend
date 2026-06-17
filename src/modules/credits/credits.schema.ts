import { z } from 'zod';

export const PaymentSchema = z.object({
    amount: z.number(),
    customerId: z.string(),
    method: z.enum ([
        "CASH",
        "E_WALLET",
        "OTHER",
    ]),
    notes: z.string().optional(),
})

export type PaymentInput = z.infer<typeof PaymentSchema>;