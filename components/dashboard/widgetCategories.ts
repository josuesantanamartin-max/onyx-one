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

    // Life Widgets
    'TODAY_MENU': 'LIFE',
    'SHOPPING_LIST': 'LIFE',
    'SHOPPING_LIST_FULL': 'LIFE',
    'FAMILY_AGENDA': 'LIFE',
    'RECIPE_FAVORITES': 'LIFE',
    'WEEKLY_PLAN': 'LIFE',
    'UPCOMING_TRIPS': 'LIFE',
    'FAMILY_TASKS': 'LIFE',
    'CRITICAL_INVENTORY': 'LIFE',
    'LOW_STOCK_PANTRY': 'LIFE',
    'UPCOMING_BIRTHDAYS': 'LIFE',
};

export const getWidgetCategory = (widgetId: string): WidgetCategory => {
    return WIDGET_CATEGORIES[widgetId] || 'ALL';
};
