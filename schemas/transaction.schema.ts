import { z } from 'zod';

/**
 * Transaction validation schema
 */
export const transactionSchema = z.object({
    id: z.string().optional(),
    type: z.enum(['INCOME', 'EXPENSE']),
    amount: z
        .number()
        .positive('Amount must be greater than 0')
        .finite('Amount must be a valid number'),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    category: z
        .string()
        .min(1, 'Category cannot be empty'),
    subCategory: z.string().optional(),
    accountId: z
        .string()
        .min(1, 'Account cannot be empty'),
    description: z
        .string()
        .min(1, 'Description cannot be empty')
        .max(500, 'Description must be less than 500 characters'),
    isRecurring: z.boolean().optional(),
    frequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY']).optional(),
    notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

/**
 * Validate transaction data
 */
export function validateTransaction(data: unknown) {
    return transactionSchema.safeParse(data);
}

/**
 * Type inference from schema
 */
export type TransactionInput = z.infer<typeof transactionSchema>;
