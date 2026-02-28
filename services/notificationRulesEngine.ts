// ─────────────────────────────────────────────────────────────────────────────
//  Aliseus — Notification Rules Engine
//  Pure function: takes app data → returns notifications to add.
//  All IDs are deterministic so repeated evaluations don't create duplicates.
// ─────────────────────────────────────────────────────────────────────────────

import { OnyxNotification } from '../types/notifications';
import { Budget, Goal, Debt, Transaction } from '../types';
import { Ingredient, ShoppingItem, Trip } from '../types';
import { Language } from '../types/shared';

// ─── i18n labels ──────────────────────────────────────────────────────────────
const t = (lang: Language, key: string): string => {
    const strings: Record<string, Record<Language, string>> = {
        // Budget
        'budget.exceeded.title': { ES: '⚠️ Presupuesto superado', EN: '⚠️ Budget exceeded', FR: '⚠️ Budget dépassé' },
        'budget.exceeded.msg': { ES: 'Has superado el límite de "{cat}": {spent} / {limit}', EN: 'You exceeded the "{cat}" budget: {spent} / {limit}', FR: 'Vous avez dépassé le budget "{cat}": {spent} / {limit}' },
        'budget.warning.title': { ES: '📊 Presupuesto al {pct}%', EN: '📊 Budget at {pct}%', FR: '📊 Budget à {pct}%' },
        'budget.warning.msg': { ES: 'Llevas {spent} de {limit} en "{cat}"', EN: '{spent} of {limit} used in "{cat}"', FR: '{spent} sur {limit} utilisé dans "{cat}"' },
        'budget.action': { ES: 'Ver presupuestos', EN: 'View budgets', FR: 'Voir les budgets' },
        // Goal
        'goal.completed.title': { ES: '🎉 ¡Meta alcanzada!', EN: '🎉 Goal reached!', FR: '🎉 Objectif atteint !' },
        'goal.completed.msg': { ES: 'Has completado la meta "{name}"', EN: 'You completed the goal "{name}"', FR: 'Vous avez atteint l\'objectif "{name}"' },
        'goal.deadline.title': { ES: '⏳ Meta próxima a vencer', EN: '⏳ Goal deadline approaching', FR: '⏳ Échéance d\'objectif proche' },
        'goal.deadline.msg': { ES: '"{name}" vence en {days} días y llevas {pct}%', EN: '"{name}" is due in {days} days and you\'re at {pct}%', FR: '"{name}" expire dans {days} jours et vous êtes à {pct}%' },
        'goal.action': { ES: 'Ver metas', EN: 'View goals', FR: 'Voir les objectifs' },
        // Debt
        'debt.due.title': { ES: '💳 Pago de deuda próximo', EN: '💳 Debt payment due', FR: '💳 Paiement de dette proche' },
        'debt.due.msg': { ES: 'Vence el pago mínimo de "{name}": {amount}', EN: 'Minimum payment due for "{name}": {amount}', FR: 'Paiement minimum dû pour "{name}": {amount}' },
        'debt.action': { ES: 'Ver deudas', EN: 'View debts', FR: 'Voir les dettes' },
        // Pantry
        'pantry.empty.title': { ES: '🛒 Sin stock en despensa', EN: '🛒 Pantry item out of stock', FR: '🛒 Article de garde-manger épuisé' },
        'pantry.empty.msg': { ES: 'Te has quedado sin "{name}"', EN: 'You\'re out of "{name}"', FR: 'Vous n\'avez plus de "{name}"' },
        'pantry.low.title': { ES: '📦 Stock bajo en despensa', EN: '📦 Low pantry stock', FR: '📦 Stock faible en garde-manger' },
        'pantry.low.msg': { ES: 'Queda poco de "{name}": {qty} {unit}', EN: 'Low stock of "{name}": {qty} {unit}', FR: 'Stock faible de "{name}": {qty} {unit}' },
        'pantry.action': { ES: 'Ver despensa', EN: 'View pantry', FR: 'Voir le garde-manger' },
        // Shopping
        'shopping.pending.title': { ES: '🛍️ Lista de compras pendiente', EN: '🛍️ Shopping list pending', FR: '🛍️ Liste de courses en attente' },
        'shopping.pending.msg': { ES: 'Tienes {count} artículo(s) por comprar', EN: 'You have {count} item(s) to buy', FR: 'Vous avez {count} article(s) à acheter' },
        'shopping.action': { ES: 'Ver lista', EN: 'View list', FR: 'Voir la liste' },
        // Trip
        'trip.soon.title': { ES: '✈️ Viaje próximo', EN: '✈️ Upcoming trip', FR: '✈️ Voyage imminent' },
        'trip.soon.msg': { ES: '"{name}" sale en {days} días', EN: '"{name}" departs in {days} days', FR: '"{name}" part dans {days} jours' },
        'trip.action': { ES: 'Ver viajes', EN: 'View trips', FR: 'Voir les voyages' },
    };
    return strings[key]?.[lang] ?? strings[key]?.['EN'] ?? key;
};

const fmt = (amount: number, currency: string) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

const replace = (str: string, vars: Record<string, string | number>) =>
    Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), str);

// ─── Types accepted by the engine ─────────────────────────────────────────────
export interface FinanceSnapshot {
    budgets: Budget[];
    transactions: Transaction[];
    goals: Goal[];
    debts: Debt[];
    currency: string;
}

export interface LifeSnapshot {
    pantryItems: Ingredient[];
    shoppingList: ShoppingItem[];
    trips: Trip[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const now = () => new Date();
const daysUntil = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = d.getTime() - now().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const spentByBudget = (budget: Budget, transactions: Transaction[], currency: string): number => {
    const currentMonth = now().getMonth();
    const currentYear = now().getFullYear();
    return transactions
        .filter((tx) => {
            const d = new Date(tx.date);
            if (budget.period === 'MONTHLY') {
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear
                    && tx.type === 'EXPENSE' && tx.category === budget.category;
            }
            if (budget.period === 'YEARLY') {
                return d.getFullYear() === currentYear
                    && tx.type === 'EXPENSE' && tx.category === budget.category;
            }
            // CUSTOM: between startDate and endDate
            if (budget.startDate && budget.endDate) {
                return d >= new Date(budget.startDate) && d <= new Date(budget.endDate)
                    && tx.type === 'EXPENSE' && tx.category === budget.category;
            }
            return false;
        })
        .reduce((sum, tx) => sum + tx.amount, 0);
};

// ─── Main evaluator ───────────────────────────────────────────────────────────
export function evaluateRules(
    finance: FinanceSnapshot,
    life: LifeSnapshot,
    lang: Language = 'ES'
): OnyxNotification[] {
    const results: OnyxNotification[] = [];
    const ts = new Date().toISOString();

    // ── Finance: Budgets ──────────────────────────────────────────────────────
    for (const budget of finance.budgets) {
        const spent = spentByBudget(budget, finance.transactions, finance.currency);
        const pct = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

        if (pct >= 100) {
            results.push({
                id: `budget-exceeded-${budget.id}`,
                type: 'danger',
                module: 'finance',
                category: 'budget',
                title: t(lang, 'budget.exceeded.title'),
                message: replace(t(lang, 'budget.exceeded.msg'), {
                    cat: budget.category,
                    spent: fmt(spent, finance.currency),
                    limit: fmt(budget.limit, finance.currency),
                }),
                actionLabel: t(lang, 'budget.action'),
                actionTarget: { app: 'finance', tab: 'budgets' },
                read: false,
                createdAt: ts,
            });
        } else if (pct >= 80) {
            results.push({
                id: `budget-warning-${budget.id}-${Math.floor(pct / 5) * 5}`,
                type: 'warning',
                module: 'finance',
                category: 'budget',
                title: replace(t(lang, 'budget.warning.title'), { pct: Math.round(pct) }),
                message: replace(t(lang, 'budget.warning.msg'), {
                    cat: budget.category,
                    spent: fmt(spent, finance.currency),
                    limit: fmt(budget.limit, finance.currency),
                }),
                actionLabel: t(lang, 'budget.action'),
                actionTarget: { app: 'finance', tab: 'budgets' },
                read: false,
                createdAt: ts,
            });
        }
    }

    // ── Finance: Goals ────────────────────────────────────────────────────────
    for (const goal of finance.goals) {
        const pct = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

        if (pct >= 100) {
            results.push({
                id: `goal-completed-${goal.id}`,
                type: 'success',
                module: 'finance',
                category: 'goal',
                title: t(lang, 'goal.completed.title'),
                message: replace(t(lang, 'goal.completed.msg'), { name: goal.name }),
                actionLabel: t(lang, 'goal.action'),
                actionTarget: { app: 'finance', tab: 'goals' },
                read: false,
                createdAt: ts,
            });
        } else if (goal.deadline) {
            const days = daysUntil(goal.deadline);
            if (days >= 0 && days <= 30 && pct < 80) {
                results.push({
                    id: `goal-deadline-${goal.id}-${days}`,
                    type: 'warning',
                    module: 'finance',
                    category: 'goal',
                    title: t(lang, 'goal.deadline.title'),
                    message: replace(t(lang, 'goal.deadline.msg'), {
                        name: goal.name,
                        days,
                        pct: Math.round(pct),
                    }),
                    actionLabel: t(lang, 'goal.action'),
                    actionTarget: { app: 'finance', tab: 'goals' },
                    read: false,
                    createdAt: ts,
                });
            }
        }
    }

    // ── Finance: Debts ────────────────────────────────────────────────────────
    for (const debt of finance.debts) {
        const dueDay = parseInt(debt.dueDate, 10);
        const today = now().getDate();
        // Trigger if payment day is today or tomorrow
        if (!isNaN(dueDay) && (dueDay === today || dueDay === today + 1)) {
            results.push({
                id: `debt-due-${debt.id}-${now().getFullYear()}-${now().getMonth()}`,
                type: 'danger',
                module: 'finance',
                category: 'debt',
                title: t(lang, 'debt.due.title'),
                message: replace(t(lang, 'debt.due.msg'), {
                    name: debt.name,
                    amount: fmt(debt.minPayment, finance.currency),
                }),
                actionLabel: t(lang, 'debt.action'),
                actionTarget: { app: 'finance', tab: 'debts' },
                read: false,
                createdAt: ts,
            });
        }
    }

    // ── Life: Pantry ──────────────────────────────────────────────────────────
    for (const item of life.pantryItems) {
        const qty = item.quantity ?? 0;
        const min = (item as any).minQuantity ?? 1;

        if (qty <= 0) {
            results.push({
                id: `pantry-empty-${item.id}`,
                type: 'warning',
                module: 'life',
                category: 'pantry',
                title: t(lang, 'pantry.empty.title'),
                message: replace(t(lang, 'pantry.empty.msg'), { name: item.name }),
                actionLabel: t(lang, 'pantry.action'),
                actionTarget: { app: 'life', tab: 'kitchen' },
                read: false,
                createdAt: ts,
            });
        } else if (qty <= min) {
            results.push({
                id: `pantry-low-${item.id}`,
                type: 'info',
                module: 'life',
                category: 'pantry',
                title: t(lang, 'pantry.low.title'),
                message: replace(t(lang, 'pantry.low.msg'), {
                    name: item.name,
                    qty,
                    unit: item.unit ?? '',
                }),
                actionLabel: t(lang, 'pantry.action'),
                actionTarget: { app: 'life', tab: 'kitchen' },
                read: false,
                createdAt: ts,
            });
        }
    }

    // ── Life: Shopping list ───────────────────────────────────────────────────
    const pendingItems = life.shoppingList.filter((i) => !(i as any).purchased);
    if (pendingItems.length > 0) {
        results.push({
            id: `shopping-pending-${pendingItems.length}`,
            type: 'info',
            module: 'life',
            category: 'shopping',
            title: t(lang, 'shopping.pending.title'),
            message: replace(t(lang, 'shopping.pending.msg'), { count: pendingItems.length }),
            actionLabel: t(lang, 'shopping.action'),
            actionTarget: { app: 'life', tab: 'kitchen-list' },
            read: false,
            createdAt: ts,
        });
    }

    // ── Life: Trips ───────────────────────────────────────────────────────────
    for (const trip of life.trips) {
        const departure = trip.startDate;
        if (!departure) continue;
        const days = daysUntil(departure);
        if (days >= 0 && days <= 7) {
            results.push({
                id: `trip-soon-${trip.id}-${days}`,
                type: 'info',
                module: 'life',
                category: 'trip',
                title: t(lang, 'trip.soon.title'),
                message: replace(t(lang, 'trip.soon.msg'), { name: trip.destination, days }),
                actionLabel: t(lang, 'trip.action'),
                actionTarget: { app: 'life', tab: 'travel' },
                read: false,
                createdAt: ts,
            });
        }
    }

    return results;
}
