import { z } from 'zod';

/**
 * Recipe ingredient schema
 */
const recipeIngredientSchema = z.object({
    name: z
        .string({
            required_error: 'Ingredient name is required',
        })
        .min(1, 'Ingredient name cannot be empty'),
    quantity: z
        .number({
            required_error: 'Quantity is required',
            invalid_type_error: 'Quantity must be a number',
        })
        .positive('Quantity must be greater than 0'),
    unit: z
        .string({
            required_error: 'Unit is required',
        })
        .min(1, 'Unit cannot be empty'),
});

/**
 * Recipe validation schema
 */
export const recipeSchema = z.object({
    id: z.string().optional(),
    name: z
        .string({
            required_error: 'Recipe name is required',
        })
        .min(1, 'Recipe name cannot be empty')
        .max(200, 'Recipe name must be less than 200 characters'),
    prepTime: z
        .number({
            required_error: 'Preparation time is required',
            invalid_type_error: 'Preparation time must be a number',
        })
        .int('Preparation time must be an integer')
        .positive('Preparation time must be greater than 0')
        .max(1440, 'Preparation time must be less than 24 hours'),
    calories: z
        .number({
            required_error: 'Calories are required',
            invalid_type_error: 'Calories must be a number',
        })
        .int('Calories must be an integer')
        .nonnegative('Calories must be non-negative'),
    tags: z
        .array(z.string())
        .min(1, 'At least one tag is required')
        .max(10, 'Maximum 10 tags allowed'),
    rating: z
        .number()
        .min(0, 'Rating must be between 0 and 5')
        .max(5, 'Rating must be between 0 and 5')
        .optional()
        .default(0),
    baseServings: z
        .number({
            required_error: 'Base servings is required',
            invalid_type_error: 'Base servings must be a number',
        })
        .int('Base servings must be an integer')
        .positive('Base servings must be greater than 0')
        .max(100, 'Base servings must be less than 100'),
    image: z.string().url('Image must be a valid URL').optional(),
    courseType: z
        .enum(['STARTER', 'MAIN', 'DESSERT', 'SIDE', 'DRINK'], {
            errorMap: () => ({ message: 'Invalid course type' }),
        })
        .optional(),
    ingredients: z
        .array(recipeIngredientSchema)
        .min(1, 'At least one ingredient is required')
        .max(50, 'Maximum 50 ingredients allowed'),
    instructions: z
        .array(
            z
                .string()
                .min(1, 'Instruction cannot be empty')
                .max(500, 'Instruction must be less than 500 characters')
        )
        .min(1, 'At least one instruction is required')
        .max(50, 'Maximum 50 instructions allowed'),
});

/**
 * Validate recipe data
 */
export function validateRecipe(data: unknown) {
    return recipeSchema.safeParse(data);
}

/**
 * Type inference from schema
 */
export type RecipeInput = z.infer<typeof recipeSchema>;
