import { z } from 'zod';

export const retirementPlanSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    targetAge: z.number().min(18).max(120),
    currentAge: z.number().min(18).max(100),
    currentSavings: z.number().min(0, 'Current savings must be positive'),
    monthlyContribution: z.number().min(0, 'Monthly contribution must be positive'),
    expectedReturn: z.number().min(0).max(30, 'Expected return seems unrealistic'),
    inflationRate: z.number().min(0).max(20, 'Inflation rate seems unrealistic'),
    targetMonthlyIncome: z.number().min(0, 'Target income must be positive'),
    linkedGoalId: z.string().optional(),
});

export const retirementSimulationSchema = retirementPlanSchema.omit({
    id: true,
    name: true,
    linkedGoalId: true
});

export type RetirementPlanInput = z.infer<typeof retirementPlanSchema>;
export type RetirementSimulationInput = z.infer<typeof retirementSimulationSchema>;

export const validateRetirementPlan = (data: unknown) => {
    return retirementPlanSchema.safeParse(data);
};
