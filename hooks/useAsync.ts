import { useState, useCallback, useEffect, useRef } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

interface UseAsyncOptions {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
}

/**
 * Custom hook for handling async operations with loading and error states
 */
export function useAsync<T>(
    asyncFunction: (...args: any[]) => Promise<T>,
    options: UseAsyncOptions = {}
) {
    const { immediate = false, onSuccess, onError } = options;
    const { showError } = useErrorHandler();

    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        loading: immediate,
        error: null,
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    const execute = useCallback(
        async (...args: any[]) => {
            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Create new abort controller
            abortControllerRef.current = new AbortController();

            setState({ data: null, loading: true, error: null });

            try {
                const result = await asyncFunction(...args);

                // Only update state if not aborted
                if (!abortControllerRef.current.signal.aborted) {
                    setState({ data: result, loading: false, error: null });
                    onSuccess?.(result);
                }

                return result;
            } catch (error) {
                // Only update state if not aborted
                if (!abortControllerRef.current.signal.aborted) {
                    const err = error instanceof Error ? error : new Error('Unknown error');
                    setState({ data: null, loading: false, error: err });

                    // Show error toast
                    showError(err);
                    onError?.(err);
                }

                throw error;
            }
        },
        [asyncFunction, onSuccess, onError, showError]
    );

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    // Execute immediately if requested
    useEffect(() => {
        if (immediate) {
            execute();
        }

        // Cleanup: abort on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [immediate, execute]);

    return {
        ...state,
        execute,
        reset,
    };
}
