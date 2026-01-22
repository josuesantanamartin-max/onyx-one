import { z } from 'zod';

/**
 * Transaction validation schema
 */
export const transactionSchema = z.object({
    id: z.string().optional(),
    type: z.enum(['INCOME', 'EXPENSE'], {
        errorMap: () => ({ message: 'Transaction type must be either INCOME or EXPENSE' }),
    }),
    amount: z
        .number({
            required_error: 'Amount is required',
            invalid_type_error: 'Amount must be a number',
        })
        .positive('Amount must be greater than 0')
        .finite('Amount must be a valid number'),
    date: z
        .string({
            required_error: 'Date is required',
        })
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    category: z
        .string({
            required_error: 'Category is required',
        })
        .min(1, 'Category cannot be empty'),
    subCategory: z.string().optional(),
    accountId: z
        .string({
            required_error: 'Account is required',
        })
        .min(1, 'Account cannot be empty'),
    description: z
        .string({
            required_error: 'Description is required',
        })
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
