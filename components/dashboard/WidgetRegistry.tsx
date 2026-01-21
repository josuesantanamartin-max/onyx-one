import React from 'react';

// Finance Widgets
import NetWorthCard from '../features/finance/dashboard/widgets/NetWorthCard';
import MonthlyFlowWidget from '../features/finance/dashboard/widgets/MonthlyFlowWidget';
import ActiveGoalsWidget from '../features/finance/dashboard/widgets/ActiveGoalsWidget';
import ActiveDebtsWidget from '../features/finance/dashboard/widgets/ActiveDebtsWidget';
import CategoryDistributionChart from '../features/finance/dashboard/widgets/CategoryDistributionChart';
import BudgetStatusWidget from '../features/finance/dashboard/widgets/BudgetStatusWidget';
import TransactionExplorer from '../features/finance/dashboard/widgets/TransactionExplorer';
import SpendingForecast from '../features/finance/dashboard/widgets/SpendingForecast';
import FinanceProjectionWidget from '../features/finance/FinanceProjectionWidget';
import TimelineEvolutionWidget from '../features/finance/dashboard/widgets/TimelineEvolutionWidget';

// Life Widgets
import DailyMenuWidget from '../features/life/dashboard/widgets/DailyMenuWidget';
import PantryStatusWidget from '../features/life/dashboard/widgets/PantryStatusWidget';
import FamilyAgendaWidget from '../features/life/dashboard/widgets/FamilyAgendaWidget';

// Types
import { Transaction, Account, Debt, Goal, CategoryStructure, Budget } from '@/types';

export const WIDGET_REGISTRY: Record<string, React.ComponentType<any>> = {
    'NET_WORTH': NetWorthCard,
    'MONTHLY_FLOW': MonthlyFlowWidget,
    'CATEGORY_CHART': CategoryDistributionChart,
    'EXPLORER': TransactionExplorer,
    'ACTIVE_GOALS': ActiveGoalsWidget,
    'ACTIVE_DEBTS': ActiveDebtsWidget,
    'SPENDING_FORECAST': SpendingForecast,
    'TODAY_MENU': DailyMenuWidget,
    'SHOPPING_LIST': PantryStatusWidget,
    'FAMILY_AGENDA': FamilyAgendaWidget,
    'BUDGET_STATUS': BudgetStatusWidget,
    'PROJECTION_WIDGET': FinanceProjectionWidget,
    'TIMELINE_EVOLUTION': TimelineEvolutionWidget,
};

// Widget Layout Configuration
export const WIDGET_CONFIG: Record<string, { colSpan: string; label: string }> = {
    'NET_WORTH': { colSpan: 'col-span-12 lg:col-span-8', label: 'Patrimonio Neto' },
    'MONTHLY_FLOW': { colSpan: 'col-span-12 lg:col-span-4', label: 'Flujo Mensual' },
    'CATEGORY_CHART': { colSpan: 'col-span-12', label: 'Distribución Gastos' },
    'EXPLORER': { colSpan: 'col-span-12', label: 'Explorador Transacciones' },
    'ACTIVE_GOALS': { colSpan: 'col-span-12 lg:col-span-6', label: 'Metas Activas' },
    'ACTIVE_DEBTS': { colSpan: 'col-span-12 lg:col-span-6', label: 'Deudas Activas' },
    'SPENDING_FORECAST': { colSpan: 'col-span-12 lg:col-span-6', label: 'Previsión Gastos' },
    'TODAY_MENU': { colSpan: 'col-span-12 lg:col-span-8', label: 'Menú de Hoy' },
    'SHOPPING_LIST': { colSpan: 'col-span-12 lg:col-span-4', label: 'Despensa & Lista' },
    'FAMILY_AGENDA': { colSpan: 'col-span-12 lg:col-span-4', label: 'Agenda Familiar' },
    'BUDGET_STATUS': { colSpan: 'col-span-12', label: 'Estado Presupuestos' },
    'PROJECTION_WIDGET': { colSpan: 'col-span-12 lg:col-span-8', label: 'Proyección Balance' },
    'TIMELINE_EVOLUTION': { colSpan: 'col-span-12', label: 'Evolución Temporal' },
};

// Helper type for props passed to dynamic widgets
export interface DashboardDataProps {
    transactions: Transaction[];
    accounts: Account[];
    debts: Debt[];
    goals: Goal[];
    categories: CategoryStructure[];
    budgets: Budget[];

    // Computed values
    monthlyIncome: number;
    monthlyExpenses: number;

    // UI State
    onNavigate: (app: string, tab?: string) => void;
    selectedDate: Date;
    timeMode: 'MONTH' | 'YEAR';

    // Handlers
    onFilter?: (category: string, subCategory?: string) => void;
}
