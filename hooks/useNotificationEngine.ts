import { useEffect, useRef } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useLifeStore } from '../store/useLifeStore';
import { useUserStore } from '../store/useUserStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { evaluateRules } from '../services/notificationRulesEngine';

const EVALUATION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * useNotificationEngine — mounts at shell level and continuously evaluates
 * business rules against Finance + Life state.
 *
 * Should be rendered exactly once in MainShell.
 */
export function useNotificationEngine() {
    const { budgets, transactions, goals, debts, currency } = useFinanceStore();
    const { pantryItems, shoppingList, trips } = useLifeStore();
    const { language } = useUserStore();
    const { addNotifications } = useNotificationStore();

    const evaluate = () => {
        const newNotifications = evaluateRules(
            { budgets, transactions, goals, debts, currency },
            { pantryItems, shoppingList, trips },
            language
        );
        if (newNotifications.length > 0) {
            addNotifications(newNotifications);
        }
    };

    // Evaluate immediately when data changes
    useEffect(() => {
        evaluate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [budgets, transactions, goals, debts, pantryItems, shoppingList, trips, language]);

    // Also evaluate on a background interval (catches date-based rules e.g. "due today")
    const evaluateRef = useRef(evaluate);
    evaluateRef.current = evaluate;

    useEffect(() => {
        const interval = setInterval(() => evaluateRef.current(), EVALUATION_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);
}
