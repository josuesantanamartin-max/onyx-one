import { ZodError } from 'zod';

/**
 * Format Zod validation errors into user-friendly messages
 */
export function formatZodErrors(error: ZodError): Record<string, string> {
    const formattedErrors: Record<string, string> = {};

    error.issues.forEach((err) => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
    });

    return formattedErrors;
}

/**
 * Get first error message from Zod validation
 */
export function getFirstZodError(error: ZodError): string {
    if (error.issues.length > 0) {
        return error.issues[0].message;
    }
    return 'Validation failed';
}

/**
 * Validate data with a Zod schema and return formatted errors
 */
export function validateWithSchema<T>(
    schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: ZodError } },
    data: unknown
): { success: boolean; data?: T; errors?: Record<string, string> } {
    const result = schema.safeParse(data);

    if (result.success) {
        return {
            success: true,
            data: result.data,
        };
    }

    return {
        success: false,
        errors: formatZodErrors(result.error!),
    };
}

/**
 * Create a validation error message for forms
 */
export function createValidationMessage(
    errors: Record<string, string>,
    fieldName: string
): string | undefined {
    return errors[fieldName];
}

/**
 * Check if a field has validation errors
 */
export function hasFieldError(
    errors: Record<string, string> | undefined,
    fieldName: string
): boolean {
    if (!errors) return false;
    return fieldName in errors;
}

/**
 * Get all error messages as an array
 */
export function getAllErrorMessages(errors: Record<string, string>): string[] {
    return Object.values(errors);
}
