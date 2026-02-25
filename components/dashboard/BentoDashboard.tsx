import React, { useState, useMemo } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { useUserStore } from '../../store/useUserStore';
import { useLifeStore } from '../../store/useLifeStore';
import {
    Settings, Coffee, Sunset, Moon, Search, LayoutGrid, CalendarRange, Wallet,
    TrendingUp, Target, Receipt, CreditCard, ShoppingBag, Utensils, Heart, PiggyBank,
    Activity, Clock, CalendarDays, LineChart, PieChart, ShieldCheck, Map, ClipboardList, AlertTriangle, BookOpen, Layers, ShoppingCart,
    Zap, Calendar, ChefHat, Users, Plane
} from 'lucide-react';
import { WidgetCategory } from '../../types';

import { WIDGET_REGISTRY, WIDGET_CONFIG, DashboardDataProps } from './WidgetRegistry';
import { getWidgetCategory } from './widgetCategories';
import BentoSection from './BentoSection';
import BentoTile from './BentoTile';
import GlobalSearch from '../ui/GlobalSearch';
import SampleDataBanner from '../common/SampleDataBanner';
import { AnimatedList, AnimatedListItem } from '../common/animations/AnimatedList';
import { Button } from '../ui/Button';
import LayoutSelector from './LayoutSelector';
import WidgetGallery from './WidgetGallery';
import EditModeToolbar from './EditModeToolbar';

const GREETINGS = {
    morning: { text: 'Buenos días, Jefe', sub: 'Comienza el día con claridad financiera.', icon: Coffee, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    afternoon: { text: 'Buenas tardes', sub: 'Mantén el ritmo de tus objetivos.', icon: Sunset, color: 'text-amber-600', bg: 'bg-amber-50' },
    evening: { text: 'Buenas noches', sub: 'Revisa tus logros y descansa.', icon: Moon, color: 'text-purple-600', bg: 'bg-purple-50' },
};

const BentoDashboard: React.FC = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    // State to track which widget is inline-expanded. Null = none.
    const [expandedWidgetId, setExpandedWidgetId] = useState<string | null>(null);

    const {
        dashboardLayouts, activeLayoutId, activeDashboardView, isEditMode,
        setEditMode, saveLayout, setActiveLayout, setActiveDashboardView,
        setActiveApp, setFinanceActiveTab, setLifeActiveTab,
        theme, setTheme, hasCompletedOnboarding, cookiePreferences
    } = useUserStore();

    const {
        transactions = [],
        accounts = [],
        debts = [],
        goals = [],
        categories = [],
        budgets = []
    } = useFinanceStore();

    const {
        weeklyPlans = [],
        pantryItems = [],
        shoppingList = [],
        recipes = [],
        trips = [],
        familyMembers = [],
        vaultDocuments = [],
        homeAssets = []
    } = useLifeStore();

    const [timeMode, setTimeMode] = useState<'MONTH' | 'YEAR'>('MONTH');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Tour - wait for cookies to be accepted first
    React.useEffect(() => {
        const hasSeenTour = localStorage.getItem('onyx_has_seen_tour');
        if (hasCompletedOnboarding && !hasSeenTour && cookiePreferences) {
            setTimeout(() => {
                import('./DashboardTour').then(mod => mod.startDashboardTour());
                localStorage.setItem('onyx_has_seen_tour', 'true');
            }, 500);
        }
    }, [hasCompletedOnboarding, cookiePreferences]);

    const activeLayout = useMemo(
        () => dashboardLayouts.find(l => l.id === activeLayoutId),
        [dashboardLayouts, activeLayoutId]
    );

    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const greeting = GREETINGS[timeOfDay];

    const handleNavigate = (app: string, tab?: string) => {
        setActiveApp(app);
        if (app === 'finance' && tab) setFinanceActiveTab(tab);
        if (app === 'life' && tab) setLifeActiveTab(tab);
        setExpandedWidgetId(null); // Collapse widget on navigate
    };

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const currentPeriodTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return timeMode === 'YEAR'
            ? tDate.getFullYear() === year
            : tDate.getFullYear() === year && tDate.getMonth() === month;
    });

    const monthlyIncome = currentPeriodTransactions
        .filter(t => t.type === 'INCOME' && t.category !== 'Transferencia')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const monthlyExpenses = currentPeriodTransactions
        .filter(t => t.type === 'EXPENSE' && t.category !== 'Transferencia')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const widgetProps: DashboardDataProps = {
        transactions, accounts, debts, goals, categories, budgets,
        monthlyIncome, monthlyExpenses,
        onNavigate: handleNavigate,
        selectedDate, timeMode,
        onFilter: () => { setActiveApp('finance'); setFinanceActiveTab('transactions'); },
    };

    // Helper to get exactly which widgets are active in the current layout
    const activeWidgetIds = useMemo(() => {
        if (!activeLayout) return [];
        // In Edit Mode, we show visible items so user can interact with them
        // Default to true for backward compatibility with older saved layouts
        return activeLayout.widgets.filter(w => isEditMode ? true : (w.visible !== false)).map(w => w.i);
    }, [activeLayout, isEditMode]);

    // Save / Cancel Layout changes
    const handleSaveLayout = () => {
        if (!activeLayout) return;
        // The order logic from legacy dashboard is currently skipped 
        // as BentoSection renders categories automatically.
        saveLayout({ ...activeLayout });
        setEditMode(false);
        setIsGalleryOpen(false);
    };

    const handleCancelEdit = () => {
        // In a real implementation we would revert widgetOrder here.
        setEditMode(false);
        setIsGalleryOpen(false);
    };

    const handleRemoveWidget = (widgetId: string) => {
        if (!activeLayout) return;
        const updatedWidgets = activeLayout.widgets.filter(w => w.i !== widgetId);
        saveLayout({ ...activeLayout, widgets: updatedWidgets });
    };

    const handleReorderDrop = (sourceId: string, targetId: string) => {
        if (!activeLayout) return;

        // Find indices
        const sourceIndex = activeLayout.widgets.findIndex(w => w.i === sourceId);
        const targetIndex = activeLayout.widgets.findIndex(w => w.i === targetId);

        if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) return;

        // Clone the widgets array to mutate
        const newWidgets = [...activeLayout.widgets];

        // Remove the source widget
        const [movedWidget] = newWidgets.splice(sourceIndex, 1);

        // At this point the target index might have shifted if sourceIndex < targetIndex
        const insertIndex = sourceIndex < targetIndex ? targetIndex : targetIndex;

        // Insert the dragged widget at the target position
        newWidgets.splice(insertIndex, 0, movedWidget);

        // Save the newly ordered layout
        saveLayout({ ...activeLayout, widgets: newWidgets });
    };

    const handleChangeWidgetSize = (widgetId: string, newSize: string) => {
        if (!activeLayout) return;
        const updatedWidgets = activeLayout.widgets.map(w => {
            if (w.i === widgetId) {
                // We cast newSize to the specific types allowed, or just let TS infer if it's wide enough
                return { ...w, sizeOverride: newSize as any };
            }
            return w;
        });
        saveLayout({ ...activeLayout, widgets: updatedWidgets });
    };

    // Formatters
    const formatCurrency = (val: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    // Dynamic Tile Data generators based on Widget ID
    const getTileData = (id: string) => {
        const config = WIDGET_CONFIG[id];
        const title = config?.label || id;

        switch (id) {
            case 'NET_WORTH':
                const netWorth = accounts.reduce((acc, a) => acc + a.balance, 0) - debts.reduce((acc, d) => acc + d.remainingBalance, 0);
                return { title, value: formatCurrency(netWorth), icon: Wallet, color: 'indigo' as const };
            case 'MONTHLY_FLOW':
                return { title, value: formatCurrency(monthlyIncome - monthlyExpenses), subValue: `Ing: ${formatCurrency(monthlyIncome)} | Gto: ${formatCurrency(monthlyExpenses)}`, icon: TrendingUp, color: 'emerald' as const };
            case 'TOP_CATEGORIES':
                return { title, value: 'Gastos', subValue: 'Por categoría', icon: CreditCard, color: 'rose' as const };
            case 'SAVINGS_RATE':
                const rate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
                return { title, value: `${rate.toFixed(1)}%`, subValue: 'Tasa de Ahorro', icon: Target, color: 'blue' as const };
            case 'RECENT_TRANSACTIONS':
                return { title, value: transactions.length, subValue: 'Últimas transacciones', icon: Receipt, color: 'onyx' as const };
            case 'TOP_SPENDERS':
                return { title, value: 'Top 3', subValue: 'Mayores gastos', icon: ShoppingBag, color: 'rose' as const };
            case 'ANNUAL_COMPARISON':
                return { title, value: year.toString(), subValue: 'vs Histórico', icon: CalendarRange, color: 'indigo' as const };
            case 'ACTIVE_GOALS':
                const activeCount = goals.filter(g => g.currentAmount < g.targetAmount).length;
                return { title, value: activeCount, subValue: 'Objetivos activos', icon: Target, color: 'amber' as const };
            case 'ACCOUNTS_SUMMARY':
                return { title, value: accounts.length, subValue: 'Cuentas activas', icon: Layers, color: 'indigo' as const };
            case 'FINANCIAL_HEALTH':
                return { title, value: 'Estado', subValue: 'Métricas clave', icon: Activity, color: 'emerald' as const };
            case 'UPCOMING_PAYMENTS':
                return { title, value: debts.length, subValue: 'Por vencer', icon: Clock, color: 'rose' as const };
            case 'MONTHLY_GOALS':
                return { title, value: 'Proyección', subValue: 'Del mes', icon: Target, color: 'purple' as const };
            case 'PROJECTION_WIDGET':
                return { title, value: 'Futuro', subValue: 'Proyección de balance', icon: LineChart, color: 'blue' as const };
            case 'EXPLORER':
                return { title, value: 'Búsqueda', subValue: 'Explorador avanzado', icon: Search, color: 'indigo' as const };
            case 'CATEGORY_CHART':
                return { title, value: 'Desglose', subValue: 'Distribución', icon: PieChart, color: 'onyx' as const };
            case 'SPENDING_FORECAST':
                return { title, value: 'Tendencia', subValue: 'Previsión de gasto', icon: TrendingUp, color: 'rose' as const };
            case 'BUDGET_STATUS':
                return { title, value: budgets.length, subValue: 'Presupuestos', icon: PiggyBank, color: 'amber' as const };
            case 'TIMELINE_EVOLUTION':
                return { title, value: 'Evolución', subValue: 'Histórico', icon: LineChart, color: 'blue' as const };
            case 'LOW_STOCK_PANTRY':
                const lowCount = pantryItems.filter(i => i.quantity <= (i.lowStockThreshold || 0)).length;
                return { title, value: lowCount, subValue: 'Artículos bajos', icon: ShoppingBag, color: 'rose' as const };
            case 'TODAY_MENU':
                return { title, value: 'Menú', subValue: 'Plan de hoy', icon: Utensils, color: 'emerald' as const };
            case 'SHOPPING_LIST':
                return { title, value: shoppingList.length, subValue: 'Por comprar', icon: ShoppingCart, color: 'amber' as const };
            case 'SHOPPING_LIST_FULL':
                return { title, value: shoppingList.length, subValue: 'Artículos en lista', icon: ShoppingCart, color: 'amber' as const };
            case 'FAMILY_AGENDA':
                return { title, value: 'Eventos', subValue: 'Próximos', icon: CalendarDays, color: 'indigo' as const };
            case 'RECIPE_FAVORITES':
                return { title, value: 'Recetas', subValue: 'Guardadas', icon: BookOpen, color: 'rose' as const };
            case 'WEEKLY_PLAN':
                return { title, value: weeklyPlans.length, subValue: 'Días planificados', icon: CalendarDays, color: 'purple' as const };
            case 'UPCOMING_TRIPS':
                return { title, value: 'Viajes', subValue: 'Agendados', icon: Map, color: 'blue' as const };
            case 'FAMILY_TASKS':
                return { title, value: 'Por hacer', subValue: 'Tareas pendientes', icon: ClipboardList, color: 'emerald' as const };
            case 'CRITICAL_INVENTORY':
                return { title, value: 'Avisos', subValue: 'Inventario crítico', icon: AlertTriangle, color: 'rose' as const };
            case 'UPCOMING_BIRTHDAYS':
                return { title, value: familyMembers.length, subValue: 'Cumpleaños', icon: Heart, color: 'rose' as const };
            default:
                return { title, value: 'Ver', icon: LayoutGrid, color: 'onyx' as const };
        }
    };

    // Group active widgets by logical sections
    const financeCoreWidgets = activeWidgetIds.filter(id => getWidgetCategory(id) === 'FINANCE' && ['NET_WORTH', 'MONTHLY_FLOW', 'SAVINGS_RATE', 'ANNUAL_COMPARISON'].includes(id));
    const financeDetailWidgets = activeWidgetIds.filter(id => getWidgetCategory(id) === 'FINANCE' && !financeCoreWidgets.includes(id));

    // Categorize life widgets into Kitchen and General Life
    const kitchenWidgets = activeWidgetIds.filter(id => getWidgetCategory(id) === 'KITCHEN');
    const lifeGeneralWidgets = activeWidgetIds.filter(id => getWidgetCategory(id) === 'LIFE');

    // Full Widget renderer
    const renderFullWidget = (widgetId: string) => {
        const WidgetComponent = WIDGET_REGISTRY[widgetId];
        if (!WidgetComponent) {
            return <p>Widget "{widgetId}" no encontrado en el registro.</p>;
        }
        return <WidgetComponent {...widgetProps} />;
    };

    if (!activeLayout) {
        return (
            <div className="p-10 text-center">
                <p className="text-onyx-400 dark:text-onyx-500 font-bold mb-4">No se pudo cargar el diseño.</p>
                <Button variant="primary" onClick={() => setActiveLayout('default')}>
                    Restaurar Diseño Predeterminado
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full bg-onyx-50/30 dark:bg-onyx-950/30 overflow-y-auto custom-scrollbar relative">
            <SampleDataBanner />

            {/* ── Dynamic Hero Header ─────────────────────────────────── */}
            <div className="px-6 md:px-10 pt-10 pb-6 relative overflow-hidden group/header">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="animate-fade-in-up">
                        <div className={`flex items-center gap-2 ${greeting.color} font-extrabold text-[10px] uppercase tracking-[0.3em] mb-3 ${greeting.bg} w-fit px-4 py-1.5 rounded-full border border-current/10 shadow-sm`}>
                            <greeting.icon className="w-4 h-4" /> {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-onyx-900 dark:text-white tracking-tighter transition-all group-hover/header:-translate-y-1">
                            {greeting.text}
                        </h1>
                        <p className="text-onyx-400 dark:text-onyx-500 font-bold mt-1 text-sm md:text-base mb-6">{greeting.sub}</p>

                        {/* Multi-Dashboard Navigation */}
                        <div className="flex items-center gap-2 p-1 bg-onyx-100/50 dark:bg-onyx-800/50 backdrop-blur-md rounded-2xl border border-onyx-200/50 dark:border-onyx-700/50 w-fit">
                            {[
                                { id: 'FINANCE', label: 'Finanzas', icon: Wallet, layoutId: 'default', color: 'indigo' },
                                { id: 'KITCHEN', label: 'Cocina', icon: Utensils, layoutId: 'kitchen', color: 'emerald' },
                                { id: 'LIFE', label: 'Vida', icon: Heart, layoutId: 'life', color: 'rose' },
                            ].map((view) => {
                                const isActive = activeDashboardView === view.id;
                                const Icon = view.icon;
                                return (
                                    <button
                                        key={view.id}
                                        onClick={() => {
                                            setActiveDashboardView(view.id as any);
                                            setActiveLayout(view.layoutId);
                                        }}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${isActive
                                            ? `bg-white dark:bg-onyx-700 text-${view.color}-600 dark:text-${view.color}-400 shadow-md scale-105`
                                            : 'text-onyx-500 hover:text-onyx-700 dark:hover:text-onyx-300 hover:bg-white/50 dark:hover:bg-onyx-700/50'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                                        <span className="hidden sm:inline">{view.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/50 dark:bg-onyx-900/50 backdrop-blur-md p-2 rounded-2xl border border-onyx-100 dark:border-onyx-800 shadow-sm">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Onyx Central v2.0</span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[9px] font-bold text-onyx-400 uppercase">Premium Active</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" onClick={() => setIsSearchOpen(true)} className="p-2.5 rounded-xl hover:bg-onyx-100 dark:hover:bg-onyx-800">
                                <Search className="w-4 h-4 text-onyx-600 dark:text-onyx-400" />
                            </Button>
                            <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl hover:bg-onyx-100 dark:hover:bg-onyx-800">
                                {theme === 'dark' ? <Sunset className="w-4 h-4 text-onyx-400" /> : <Moon className="w-4 h-4 text-onyx-600" />}
                            </Button>
                            <div className="w-px h-6 bg-onyx-200 dark:bg-onyx-700 mx-1"></div>
                            {!isEditMode ? (
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setEditMode(true);
                                        setIsGalleryOpen(true);
                                    }}
                                    className="px-4 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Personalizar</span>
                                </Button>
                            ) : (
                                <EditModeToolbar
                                    onSave={handleSaveLayout}
                                    onCancel={handleCancelEdit}
                                    onAddWidget={() => setIsGalleryOpen(true)}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-400/5 dark:bg-indigo-400/10 blur-[120px] rounded-full pointer-events-none"></div>
            </div>

            <AnimatedList className="px-6 md:px-10 py-4 max-w-[1600px] mx-auto" staggerDelay={0.1}>

                {/* ── Quick Insights Row ─────────────────────────────────── */}
                <AnimatedListItem className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {activeDashboardView === 'FINANCE' && (
                            <>
                                {/* 1. Net Worth */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-1 rounded-lg">
                                            <TrendingUp className="w-4 h-4 text-indigo-500" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Patrimonio Neto</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1 flex items-baseline gap-1">
                                            {formatCurrency(accounts.reduce((acc, a) => acc + a.balance, 0) - debts.reduce((acc, d) => acc + d.remainingBalance, 0))}
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 2. Monthly Savings Rate */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <PiggyBank className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-tighter">Este Mes</span>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Tasa de Ahorro</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">
                                            {monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0}%
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 3. Financial Health */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Salud Financiera</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">
                                            {monthlyExpenses < monthlyIncome * 0.7 ? 'Excelente' : monthlyExpenses < monthlyIncome ? 'Estable' : 'Crítica'}
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 4. Upcoming Payments */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Alertas Activas</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">
                                            {debts.filter(d => d.dueDate).length}
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>
                            </>
                        )}

                        {activeDashboardView === 'KITCHEN' && (
                            <>
                                {/* 1. Today's Menu */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <Utensils className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Menú Hoy</p>
                                        <h3 className="text-xl font-black text-onyx-900 dark:text-white mt-1 line-clamp-1">
                                            {weeklyPlans[0]?.meals.find(m => m.dayOfWeek === new Date().getDay())?.recipeName || 'Sin planear'}
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 2. Shopping List */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <ShoppingCart className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Lista de Compra</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">
                                            {shoppingList.length} artículos
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 3. Stock Status */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Stock Crítico</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">
                                            {pantryItems.filter(i => i.quantity <= (i.lowStockThreshold || 0)).length} alertas
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 4. Recipes */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <ChefHat className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Recetas Onyx</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">
                                            {recipes.length} guardadas
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>
                            </>
                        )}

                        {activeDashboardView === 'LIFE' && (
                            <>
                                {/* 1. Family Members */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <Users className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Miembros Familia</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">
                                            {familyMembers.length} activos
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 2. Upcoming Trips */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <Plane className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Próximos Viajes</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">
                                            {trips.length} planificados
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 3. Vault Documents */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Vault Onyx</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">
                                            {vaultDocuments.length} documentos
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 4. Daily Assets */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Tareas Hoy</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">
                                            {homeAssets.length} pendientes
                                        </h3>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>
                            </>
                        )}
                    </div>
                </AnimatedListItem>

                {/* ── Finance View Sections ── */}
                {activeDashboardView === 'FINANCE' && financeCoreWidgets.length > 0 && (
                    <AnimatedListItem>
                        <BentoSection id="finance-core" title="Resumen Ejecutivo" icon={<Wallet className="w-5 h-5" />}>
                            {financeCoreWidgets.map(id => {
                                const tileData = getTileData(id);
                                const widgetConfig = WIDGET_CONFIG[id];
                                const layoutWidget = activeLayout?.widgets.find(w => w.i === id);

                                return (
                                    <BentoTile
                                        key={id}
                                        id={id}
                                        {...tileData}
                                        size={widgetConfig?.size}
                                        sizeOverride={layoutWidget?.sizeOverride}
                                        onChangeSize={(newSize) => handleChangeWidgetSize(id, newSize)}
                                        isExpanded={expandedWidgetId === id}
                                        onToggleExpand={() => setExpandedWidgetId(expandedWidgetId === id ? null : id)}
                                        fullWidgetComponent={renderFullWidget(id)}
                                        isEditMode={isEditMode}
                                        onRemove={() => handleRemoveWidget(id)}
                                        onReorderDrop={handleReorderDrop}
                                        className={expandedWidgetId === id ? 'col-span-2 md:col-span-4' : ''}
                                    />
                                );
                            })}
                        </BentoSection>
                    </AnimatedListItem>
                )}

                {activeDashboardView === 'FINANCE' && (financeDetailWidgets.length > 0 || isEditMode) && (
                    <AnimatedListItem>
                        <BentoSection id="finance-detail" title="Control Financiero" icon={<PiggyBank className="w-5 h-5" />}>
                            {financeDetailWidgets.map(id => {
                                const tileData = getTileData(id);
                                const widgetConfig = WIDGET_CONFIG[id];
                                const layoutWidget = activeLayout?.widgets.find(w => w.i === id);

                                return (
                                    <BentoTile
                                        key={id}
                                        id={id}
                                        {...tileData}
                                        size={widgetConfig?.size}
                                        sizeOverride={layoutWidget?.sizeOverride}
                                        onChangeSize={(newSize) => handleChangeWidgetSize(id, newSize)}
                                        isExpanded={expandedWidgetId === id}
                                        onToggleExpand={() => setExpandedWidgetId(expandedWidgetId === id ? null : id)}
                                        fullWidgetComponent={renderFullWidget(id)}
                                        isEditMode={isEditMode}
                                        onRemove={() => handleRemoveWidget(id)}
                                        onReorderDrop={handleReorderDrop}
                                        className={expandedWidgetId === id ? 'col-span-2 md:col-span-4' : ''}
                                    />
                                );
                            })}
                        </BentoSection>
                    </AnimatedListItem>
                )}

                {/* ── Kitchen View Sections ── */}
                {activeDashboardView === 'KITCHEN' && (kitchenWidgets.length > 0 || isEditMode) && (
                    <AnimatedListItem>
                        <BentoSection id="kitchen" title="Mi Cocina & Menú" icon={<Utensils className="w-5 h-5" />}>
                            {kitchenWidgets.map(id => {
                                const tileData = getTileData(id);
                                const widgetConfig = WIDGET_CONFIG[id];
                                const layoutWidget = activeLayout?.widgets.find(w => w.i === id);

                                return (
                                    <BentoTile
                                        key={id}
                                        id={id}
                                        {...tileData}
                                        size={widgetConfig?.size}
                                        sizeOverride={layoutWidget?.sizeOverride}
                                        onChangeSize={(newSize) => handleChangeWidgetSize(id, newSize)}
                                        isExpanded={expandedWidgetId === id}
                                        onToggleExpand={() => setExpandedWidgetId(expandedWidgetId === id ? null : id)}
                                        fullWidgetComponent={renderFullWidget(id)}
                                        isEditMode={isEditMode}
                                        onRemove={() => handleRemoveWidget(id)}
                                        onReorderDrop={handleReorderDrop}
                                        className={expandedWidgetId === id ? 'col-span-2 md:col-span-4' : ''}
                                    />
                                );
                            })}
                        </BentoSection>
                    </AnimatedListItem>
                )}

                {/* ── Life View Sections ── */}
                {activeDashboardView === 'LIFE' && (lifeGeneralWidgets.length > 0 || isEditMode) && (
                    <AnimatedListItem>
                        <BentoSection id="life" title="Agenda & Bienestar" icon={<Heart className="w-5 h-5" />}>
                            {lifeGeneralWidgets.map(id => {
                                const tileData = getTileData(id);
                                const widgetConfig = WIDGET_CONFIG[id];
                                const layoutWidget = activeLayout?.widgets.find(w => w.i === id);

                                return (
                                    <BentoTile
                                        key={id}
                                        id={id}
                                        {...tileData}
                                        size={widgetConfig?.size}
                                        sizeOverride={layoutWidget?.sizeOverride}
                                        onChangeSize={(newSize) => handleChangeWidgetSize(id, newSize)}
                                        isExpanded={expandedWidgetId === id}
                                        onToggleExpand={() => setExpandedWidgetId(expandedWidgetId === id ? null : id)}
                                        fullWidgetComponent={renderFullWidget(id)}
                                        isEditMode={isEditMode}
                                        onRemove={() => handleRemoveWidget(id)}
                                        onReorderDrop={handleReorderDrop}
                                        className={expandedWidgetId === id ? 'col-span-2 md:col-span-4' : ''}
                                    />
                                );
                            })}
                        </BentoSection>
                    </AnimatedListItem>
                )}
            </AnimatedList>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <WidgetGallery
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onDragStart={() => { }}
                onDragEnd={() => { }}
            />
        </div>
    );
};

export default BentoDashboard;
