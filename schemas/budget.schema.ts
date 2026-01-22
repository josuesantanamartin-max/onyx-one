import { z } from 'zod';

/**
 * Budget validation schema
 */
export const budgetSchema = z
    .object({
        id: z.string().optional(),
        category: z
            .string()
            .min(1, 'Category cannot be empty'),
        subCategory: z.string().optional(),
        limit: z
            .number()
            .positive('Budget limit must be greater than 0')
            .finite('Budget limit must be a valid number'),
        period: z.enum(['MONTHLY', 'YEARLY', 'CUSTOM']),
        budgetType: z.enum(['FIXED', 'PERCENTAGE']),
        percentage: z
            .number()
            .min(0, 'Percentage must be positive')
            .max(100, 'Percentage must be less than or equal to 100')
            .optional(),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
            .optional(),
    })
    .refine(
        (data) => {
            // If budgetType is PERCENTAGE, percentage must be provided
            if (data.budgetType === 'PERCENTAGE' && !data.percentage) {
                return false;
            }
            return true;
        },
        {
            message: 'Percentage is required when budget type is PERCENTAGE',
            path: ['percentage'],
        }
    )
    .refine(
        (data) => {
            // If period is CUSTOM, startDate and endDate must be provided
            if (data.period === 'CUSTOM' && (!data.startDate || !data.endDate)) {
                return false;
            }
            return true;
        },
        {
            message: 'Start date and end date are required for custom period budgets',
            path: ['startDate'],
        }
    )
    .refine(
        (data) => {
            // If both dates are provided, endDate must be after startDate
            if (data.startDate && data.endDate) {
                return new Date(data.endDate) > new Date(data.startDate);
            }
            return true;
        },
        {
            message: 'End date must be after start date',
            path: ['endDate'],
        }
    );

/**
 * Validate budget data
 */
export function validateBudget(data: unknown) {
    return budgetSchema.safeParse(data);
}

/**
 * Type inference from schema
 */
export type BudgetInput = z.infer<typeof budgetSchema>;
