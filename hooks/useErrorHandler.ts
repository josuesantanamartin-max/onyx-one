import { useCallback } from 'react';
import { useToastStore } from '../store/toastStore';
import { handleError, logError, AppError } from '../utils/errorHandler';

/**
 * Custom hook for consistent error handling across the application
 */
export const useErrorHandler = () => {
    const { addToast } = useToastStore();

    const showError = useCallback(
        (error: unknown, customMessage?: string) => {
            const appError = handleError(error);

            // Log the error
            logError(appError);

            // Show toast notification
            addToast({
                type: 'error',
                message: customMessage || appError.message,
                duration: appError.severity === 'high' ? 8000 : 5000,
            });

            return appError;
        },
        [addToast]
    );

    const showSuccess = useCallback(
        (message: string) => {
            addToast({
                type: 'success',
                message,
                duration: 3000,
            });
        },
        [addToast]
    );

    const showWarning = useCallback(
        (message: string) => {
            addToast({
                type: 'warning',
                message,
                duration: 5000,
            });
        },
        [addToast]
    );

    const showInfo = useCallback(
        (message: string) => {
            addToast({
                type: 'info',
                message,
                duration: 4000,
            });
        },
        [addToast]
    );

    return {
        showError,
        showSuccess,
        showWarning,
        showInfo,
    };
};
