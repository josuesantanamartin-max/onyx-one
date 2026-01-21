import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Language, QuickAction, AutomationRule, DashboardWidget, SyncLog, DashboardLayout } from '../types';
import { DEFAULT_RULES, DEFAULT_WIDGETS, DEFAULT_LAYOUTS } from '../constants';

interface UserState {
    isAuthenticated: boolean;
    isDemoMode: boolean;
    activeApp: string;
    language: Language;
    currency: 'EUR' | 'USD' | 'GBP';
    theme: 'light' | 'dark' | 'system';

    financeActiveTab: string;
    lifeActiveTab: string;
    isSidebarOpen: boolean;
    isFabOpen: boolean;
    quickAction: QuickAction | null;

    automationRules: AutomationRule[];
    dashboardWidgets: DashboardWidget[];
    syncLogs: SyncLog[];

    // Dashboard Customization
    dashboardLayouts: DashboardLayout[];
    activeLayoutId: string;
    isEditMode: boolean;
    userProfile: {
        id?: string;
        email?: string;
        full_name?: string;
        avatar_url?: string;
    } | null;
    subscription: {
        plan: 'FREE' | 'PRO' | 'BUSINESS';
        status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIAL' | 'NONE';
        expiryDate?: string;
    };
    lastSyncTime: string | null;
}

interface UserActions {
    setAuthenticated: (value: boolean) => void;
    setDemoMode: (value: boolean) => void;
    setActiveApp: (app: string) => void;
    setLanguage: (lang: Language) => void;
    setCurrency: (currency: 'EUR' | 'USD' | 'GBP') => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setSubscription: (sub: UserState['subscription']) => void;

    setFinanceActiveTab: (tab: string) => void;
    setLifeActiveTab: (tab: string) => void;
    setSidebarOpen: (isOpen: boolean) => void;
    setFabOpen: (isOpen: boolean) => void;
    setQuickAction: (action: QuickAction | null) => void;

    setAutomationRules: (rules: AutomationRule[] | ((prev: AutomationRule[]) => AutomationRule[])) => void;
    setDashboardWidgets: (widgets: DashboardWidget[] | ((prev: DashboardWidget[]) => DashboardWidget[])) => void;

    // Dashboard Layout Actions
    setActiveLayout: (layoutId: string) => void;
    saveLayout: (layout: DashboardLayout) => void;
    deleteLayout: (layoutId: string) => void;
    setEditMode: (enabled: boolean) => void;
    addWidgetToLayout: (widgetId: string) => void;
    removeWidgetFromLayout: (widgetId: string) => void;

    addSyncLog: (log: SyncLog) => void;
    setUserProfile: (profile: any) => void;
    setLastSyncTime: (time: string) => void;
}

export const useUserStore = create<UserState & UserActions>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            isDemoMode: false,
            activeApp: 'dashboard',
            language: 'ES',
            currency: 'EUR',
            theme: 'light',
            financeActiveTab: 'transactions',
            lifeActiveTab: 'kitchen-dashboard',
            isSidebarOpen: false,
            isFabOpen: false,
            quickAction: null,
            automationRules: DEFAULT_RULES,
            dashboardWidgets: DEFAULT_WIDGETS,
            syncLogs: [],
            dashboardLayouts: DEFAULT_LAYOUTS,
            activeLayoutId: 'default',
            isEditMode: false,
            userProfile: null,
            subscription: { plan: 'FREE', status: 'NONE' },
            lastSyncTime: null,

            setAuthenticated: (v) => set({ isAuthenticated: v }),
            setDemoMode: (v) => set({ isDemoMode: v }),
            setActiveApp: (v) => set({ activeApp: v }),
            setLanguage: (v) => set({ language: v }),
            setCurrency: (v) => set({ currency: v }),
            setTheme: (v) => set({ theme: v }),
            setFinanceActiveTab: (v) => set({ financeActiveTab: v }),
            setLifeActiveTab: (v) => set({ lifeActiveTab: v }),
            setSidebarOpen: (v) => set({ isSidebarOpen: v }),
            setFabOpen: (v) => set({ isFabOpen: v }),
            setQuickAction: (v) => set({ quickAction: v }),
            setSubscription: (v) => set({ subscription: v }),

            setAutomationRules: (updater) => set((state) => ({
                automationRules: typeof updater === 'function' ? updater(state.automationRules) : updater
            })),
            setDashboardWidgets: (updater) => set((state) => ({
                dashboardWidgets: typeof updater === 'function' ? updater(state.dashboardWidgets) : updater
            })),

            // Dashboard Layout Actions
            setActiveLayout: (layoutId) => set({ activeLayoutId: layoutId }),

            setEditMode: (enabled) => set({ isEditMode: enabled }),

            saveLayout: (layout) => set((state) => {
                const existing = state.dashboardLayouts.find(l => l.id === layout.id);
                if (existing) {
                    return {
                        dashboardLayouts: state.dashboardLayouts.map(l =>
                            l.id === layout.id ? { ...layout, updatedAt: new Date().toISOString() } : l
                        )
                    };
                }
                return {
                    dashboardLayouts: [...state.dashboardLayouts, layout]
                };
            }),

            deleteLayout: (layoutId) => set((state) => ({
                dashboardLayouts: state.dashboardLayouts.filter(l => l.id !== layoutId)
            })),

            addWidgetToLayout: (widgetId) => set((state) => {
                const activeLayout = state.dashboardLayouts.find(l => l.id === state.activeLayoutId);
                if (!activeLayout) return state;

                const maxY = Math.max(...activeLayout.widgets.map(w => w.y + w.h), 0);

                const newWidget = {
                    i: widgetId,
                    x: 0,
                    y: maxY,
                    w: 6,
                    h: 2,
                };

                return {
                    dashboardLayouts: state.dashboardLayouts.map(l =>
                        l.id === state.activeLayoutId
                            ? { ...l, widgets: [...l.widgets, newWidget] }
                            : l
                    )
                };
            }),

            removeWidgetFromLayout: (widgetId) => set((state) => {
                const activeLayout = state.dashboardLayouts.find(l => l.id === state.activeLayoutId);
                if (!activeLayout) return state;

                return {
                    dashboardLayouts: state.dashboardLayouts.map(l =>
                        l.id === state.activeLayoutId
                            ? { ...l, widgets: l.widgets.filter(w => w.i !== widgetId) }
                            : l
                    )
                };
            }),

            addSyncLog: (log) => set((state) => ({
                syncLogs: [
                    log,
                    ...state.syncLogs
                ].slice(0, 50)
            })),
            setUserProfile: (userProfile) => set({ userProfile }),
            setLastSyncTime: (lastSyncTime) => set({ lastSyncTime }),
        }),
        {
            name: 'onyx_user_store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isDemoMode: state.isDemoMode,
                language: state.language,
                currency: state.currency,
                theme: state.theme,
                automationRules: state.automationRules,
                dashboardWidgets: state.dashboardWidgets,
                subscription: state.subscription,
                dashboardLayouts: state.dashboardLayouts,
                activeLayoutId: state.activeLayoutId
            }),
        }
    )
);
