import { WidgetType, WidgetCategory } from '../../types';

// Widget Category Metadata
export const WIDGET_CATEGORIES: Record<string, WidgetCategory> = {
    // Finance Widgets
    'NET_WORTH': 'FINANCE',
    'MONTHLY_FLOW': 'FINANCE',
    'CATEGORY_CHART': 'FINANCE',
    'EXPLORER': 'FINANCE',
    'ACTIVE_GOALS': 'FINANCE',
    'ACTIVE_DEBTS': 'FINANCE',
    'SPENDING_FORECAST': 'FINANCE',
    'BUDGET_STATUS': 'FINANCE',
    'PROJECTION_WIDGET': 'FINANCE',
    'TIMELINE_EVOLUTION': 'FINANCE',
    'FINANCIAL_HEALTH': 'FINANCE',
    'UPCOMING_PAYMENTS': 'FINANCE',
    'ANNUAL_COMPARISON': 'FINANCE',
    'MONTHLY_GOALS': 'FINANCE',
    'ACCOUNTS_SUMMARY': 'FINANCE',
    'RECENT_TRANSACTIONS': 'FINANCE',
    'SAVINGS_RATE': 'FINANCE',
    'TOP_SPENDERS': 'FINANCE',
    'ALISEUS_INSIGHTS': 'FINANCE',
    'ALISEUS_BRAIN_WIDGET': 'FINANCE',
    'CASHFLOW_WIDGET': 'FINANCE',
    'CATEGORY_DONUT_WIDGET': 'FINANCE',

    // Life Widgets - Kitchen Dashboard
    'TODAY_MENU': 'KITCHEN',
    'SHOPPING_LIST': 'KITCHEN',
    'SHOPPING_LIST_FULL': 'KITCHEN',
    'RECIPE_FAVORITES': 'KITCHEN',
    'WEEKLY_PLAN': 'KITCHEN',
    'CRITICAL_INVENTORY': 'KITCHEN',
    'LOW_STOCK_PANTRY': 'KITCHEN',

    // Life Widgets - Life Dashboard (Non-Kitchen)
    'FAMILY_AGENDA': 'LIFE',
    'UPCOMING_TRIPS': 'LIFE',
    'FAMILY_TASKS': 'LIFE',
    'UPCOMING_BIRTHDAYS': 'LIFE',
    'INTELLIGENT_TOMORROW': 'LIFE',
};

export const getWidgetCategory = (widgetId: string): WidgetCategory => {
    return WIDGET_CATEGORIES[widgetId] || 'ALL';
};
