import React, { useState, useMemo, useEffect } from 'react';
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
    morning: { text: 'Buenos días, Jefe', sub: 'Comienza el día con claridad financiera.', icon: Coffee, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30' },
    afternoon: { text: 'Buenas tardes', sub: 'Mantén el ritmo de tus objetivos.', icon: Sunset, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30' },
    evening: { text: 'Buenas noches', sub: 'Revisa tus logros y descansa.', icon: Moon, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30' },
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
    const [currentTime, setCurrentTime] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

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

    const getContextualSub = () => {
        const today = new Date().getDate();
        const todayDebt = debts.find(d => { const d2 = parseInt(d.dueDate, 10); return d2 === today || d2 === today + 1; });
        if (todayDebt) return `⚡ Pago pendiente: ${todayDebt.name}`;
        const lowStock = pantryItems.filter(i => i.quantity <= (i.lowStockThreshold || 0));
        if (lowStock.length > 0) return `📦 ${lowStock.length} artículo${lowStock.length > 1 ? 's' : ''} bajo${lowStock.length > 1 ? 's' : ''} en despensa`;
        const nextTrip = trips.find((t: any) => t.status === 'UPCOMING');
        if (nextTrip) { const days = Math.ceil((new Date((nextTrip as any).startDate).getTime() - Date.now()) / 86400000); if (days >= 0 && days <= 14) return `✈️ Tu viaje a ${(nextTrip as any).destination} en ${days} día${days !== 1 ? 's' : ''}`; }
        return greeting.sub;
    };

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
                return { title, value: formatCurrency(netWorth), icon: Wallet, color: 'cyan' as const };
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
                return { title, value: year.toString(), subValue: 'vs Histórico', icon: CalendarRange, color: 'cyan' as const };
            case 'ACTIVE_GOALS':
                const activeCount = goals.filter(g => g.currentAmount < g.targetAmount).length;
                return { title, value: activeCount, subValue: 'Objetivos activos', icon: Target, color: 'amber' as const };
            case 'ACCOUNTS_SUMMARY':
                return { title, value: accounts.length, subValue: 'Cuentas activas', icon: Layers, color: 'cyan' as const };
            case 'FINANCIAL_HEALTH':
                return { title, value: 'Estado', subValue: 'Métricas clave', icon: Activity, color: 'emerald' as const };
            case 'UPCOMING_PAYMENTS':
                return { title, value: debts.length, subValue: 'Por vencer', icon: Clock, color: 'rose' as const };
            case 'MONTHLY_GOALS':
                return { title, value: 'Proyección', subValue: 'Del mes', icon: Target, color: 'teal' as const };
            case 'PROJECTION_WIDGET':
                return { title, value: 'Futuro', subValue: 'Proyección de balance', icon: LineChart, color: 'blue' as const };
            case 'EXPLORER':
                return { title, value: 'Búsqueda', subValue: 'Explorador avanzado', icon: Search, color: 'cyan' as const };
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
                return { title, value: 'Eventos', subValue: 'Próximos', icon: CalendarDays, color: 'cyan' as const };
            case 'RECIPE_FAVORITES':
                return { title, value: 'Recetas', subValue: 'Guardadas', icon: BookOpen, color: 'rose' as const };
            case 'WEEKLY_PLAN':
                return { title, value: weeklyPlans.length, subValue: 'Días planificados', icon: CalendarDays, color: 'teal' as const };
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
                            <span className="opacity-40">·</span>
                            {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-onyx-900 dark:text-white tracking-tighter transition-all group-hover/header:-translate-y-1">
                            {greeting.text}
                        </h1>
                        <p className="text-onyx-400 dark:text-onyx-500 font-bold mt-1 text-sm md:text-base mb-6">{getContextualSub()}</p>

                        {/* Multi-Dashboard Navigation */}
                        <div className="flex items-center gap-2 p-1 bg-onyx-100/50 dark:bg-onyx-800/50 backdrop-blur-md rounded-2xl border border-onyx-200/50 dark:border-onyx-700/50 w-fit">
                            {[
                                { id: 'FINANCE', label: 'Finanzas', icon: Wallet, layoutId: 'default', color: 'cyan' },
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
                            <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Aliseus v2.0</span>
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
                                    className="px-4 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-cyan-200 dark:shadow-cyan-900/40"
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
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-400/5 dark:bg-cyan-400/10 blur-[120px] rounded-full pointer-events-none"></div>
            </div>

            <AnimatedList className="px-6 md:px-10 py-4 max-w-[1600px] mx-auto" staggerDelay={0.1}>

                {/* ── Quick Insights Row ─────────────────────────────────── */}
                <AnimatedListItem className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {activeDashboardView === 'FINANCE' && (
                            <>
                                {/* 1. Net Worth */}
                                <div onClick={() => handleNavigate('finance', 'accounts')} className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-500/15 dark:to-teal-500/5 text-cyan-600 dark:text-cyan-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${accounts.reduce((s, a) => s + a.balance, 0) - debts.reduce((s, d) => s + d.remainingBalance, 0) >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'}`}>
                                            <TrendingUp className="w-3 h-3" /> {accounts.length} cuentas
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Patrimonio Neto</p>
                                        <h3 className="text-2xl font-black text-onyx-900 dark:text-white mt-1 leading-none">{formatCurrency(accounts.reduce((acc, a) => acc + a.balance, 0) - debts.reduce((acc, d) => acc + d.remainingBalance, 0))}</h3>
                                        <p className="text-[10px] text-onyx-400 dark:text-onyx-500 mt-1.5">{debts.length > 0 ? `${debts.length} deuda${debts.length > 1 ? 's' : ''} · ${formatCurrency(debts.reduce((s, d) => s + d.remainingBalance, 0))}` : 'Sin deudas activas'}</p>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 2. Savings Rate with progress bar */}
                                <div onClick={() => handleNavigate('finance', 'budgets')} className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/15 dark:to-teal-500/5 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <PiggyBank className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">Este Mes</span>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Tasa de Ahorro</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">{monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0}%</h3>
                                        <div className="w-full bg-onyx-100 dark:bg-onyx-800 rounded-full h-1.5 mt-2">
                                            <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-1000" style={{ width: `${Math.min(100, monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0)}%` }} />
                                        </div>
                                        <p className="text-[10px] text-onyx-400 dark:text-onyx-500 mt-1.5">{formatCurrency(monthlyIncome - monthlyExpenses)} ahorrados</p>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 3. Financial Health with color score */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/15 dark:to-yellow-500/5 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Salud Financiera</p>
                                        <h3 className={`text-3xl font-black mt-1 ${monthlyExpenses < monthlyIncome * 0.7 ? 'text-emerald-600 dark:text-emerald-400' : monthlyExpenses < monthlyIncome ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>{monthlyExpenses < monthlyIncome * 0.7 ? 'Excelente' : monthlyExpenses < monthlyIncome ? 'Estable' : 'Crítica'}</h3>
                                        <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${monthlyExpenses < monthlyIncome * 0.7 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600'}`}>
                                            <Activity className="w-3 h-3" />{monthlyIncome > 0 ? `${Math.round((monthlyExpenses / monthlyIncome) * 100)}% de ingresos` : 'Sin ingresos'}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 4. Debts with inline list */}
                                <div onClick={() => handleNavigate('finance', 'debts')} className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-500/15 dark:to-pink-500/5 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Pagos Pendientes</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">{debts.filter(d => d.dueDate).length}</h3>
                                        {debts.length > 0 ? (
                                            <div className="mt-1.5 space-y-0.5">{debts.slice(0, 2).map(d => (<p key={d.id} className="text-[10px] text-onyx-400 dark:text-onyx-500 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-400 flex-shrink-0" /><span className="truncate">{d.name} · día {d.dueDate}</span></p>))}</div>
                                        ) : (<p className="text-[10px] text-onyx-400 dark:text-onyx-500 mt-1.5">Sin deudas activas</p>)}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>
                            </>
                        )}

                        {activeDashboardView === 'KITCHEN' && (
                            <>
                                {/* 1. Today's Menu */}
                                <div onClick={() => handleNavigate('life', 'kitchen-dashboard')} className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/15 dark:to-teal-500/5 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <Utensils className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">Hoy</span>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Menú Hoy</p>
                                        <h3 className="text-xl font-black text-onyx-900 dark:text-white mt-1 line-clamp-1">{weeklyPlans[0]?.meals?.find(m => m.dayOfWeek === new Date().getDay())?.recipeName || 'Sin planear'}</h3>
                                        <p className="text-[10px] text-onyx-400 dark:text-onyx-500 mt-1">{weeklyPlans.length > 0 ? 'Plan semanal activo' : 'Sin plan semanal'}</p>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 2. Shopping List with inline items */}
                                <div onClick={() => handleNavigate('life', 'kitchen-dashboard')} className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/15 dark:to-yellow-500/5 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <ShoppingCart className="w-5 h-5" />
                                        </div>
                                        {shoppingList.length > 0 && <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full border border-amber-100 dark:border-amber-500/20">{shoppingList.length}</span>}
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Lista de Compra</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">{shoppingList.length}</h3>
                                        {shoppingList.length > 0 ? (
                                            <div className="mt-1.5 space-y-0.5">{(shoppingList as any[]).slice(0, 2).map((item, i) => (<p key={item.id || i} className="text-[10px] text-onyx-400 dark:text-onyx-500 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" /><span className="truncate">{item.name}</span></p>))}{shoppingList.length > 2 && <p className="text-[10px] text-onyx-300 dark:text-onyx-600">+{shoppingList.length - 2} más</p>}</div>
                                        ) : (<p className="text-[10px] text-onyx-400 dark:text-onyx-500 mt-1.5">Lista vacía</p>)}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 3. Stock Status with names */}
                                <div onClick={() => handleNavigate('life', 'kitchen-dashboard')} className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-500/15 dark:to-pink-500/5 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Stock Crítico</p>
                                        <h3 className={`text-3xl font-black mt-1 ${pantryItems.filter(i => i.quantity <= (i.lowStockThreshold || 0)).length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{pantryItems.filter(i => i.quantity <= (i.lowStockThreshold || 0)).length === 0 ? 'OK' : pantryItems.filter(i => i.quantity <= (i.lowStockThreshold || 0)).length}</h3>
                                        {pantryItems.filter(i => i.quantity <= (i.lowStockThreshold || 0)).length > 0 ? (
                                            <div className="mt-1.5 space-y-0.5">{pantryItems.filter(i => i.quantity <= (i.lowStockThreshold || 0)).slice(0, 2).map(item => (<p key={item.id} className="text-[10px] text-rose-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-400 flex-shrink-0" /><span className="truncate">{item.name}</span></p>))}</div>
                                        ) : (<p className="text-[10px] text-emerald-500 mt-1.5">Todo en stock ✓</p>)}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 4. Recipes with latest */}
                                <div onClick={() => handleNavigate('life', 'kitchen-dashboard')} className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-500/15 dark:to-teal-500/5 text-cyan-600 dark:text-cyan-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <ChefHat className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Recetas Aliseus</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">{recipes.length}</h3>
                                        <p className="text-[10px] text-onyx-400 dark:text-onyx-500 mt-1.5 truncate">{recipes.length > 0 ? `Última: ${(recipes as any[])[recipes.length - 1]?.name || '—'}` : 'Añade tu primera receta'}</p>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>
                            </>
                        )}

                        {activeDashboardView === 'LIFE' && (
                            <>
                                {/* 1. Family Members with avatar stack */}
                                <div onClick={() => handleNavigate('life', 'life')} className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-500/15 dark:to-pink-500/5 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <Users className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Miembros Familia</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">{familyMembers.length}</h3>
                                        {familyMembers.length > 0 && (
                                            <div className="flex -space-x-2 mt-2">
                                                {(familyMembers as any[]).slice(0, 4).map((m, i) => (<div key={m.id || i} className={`w-7 h-7 rounded-full border-2 border-white dark:border-onyx-900 flex items-center justify-center text-[10px] font-black text-white bg-gradient-to-br ${['from-rose-400 to-pink-500', 'from-teal-400 to-cyan-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500'][i % 4]}`}>{(m.name || m.full_name || '?').charAt(0).toUpperCase()}</div>))}
                                                {familyMembers.length > 4 && <div className="w-7 h-7 rounded-full bg-onyx-100 dark:bg-onyx-800 border-2 border-white dark:border-onyx-900 flex items-center justify-center text-[9px] font-black text-onyx-600 dark:text-onyx-400">+{familyMembers.length - 4}</div>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 2. Upcoming Trips with countdown */}
                                <div onClick={() => handleNavigate('life', 'travel')} className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-500/15 dark:to-teal-500/5 text-cyan-600 dark:text-cyan-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <Plane className="w-5 h-5" />
                                        </div>
                                        {trips.filter((t: any) => t.status === 'UPCOMING').length > 0 && <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-100 dark:border-cyan-500/20">{trips.filter((t: any) => t.status === 'UPCOMING').length}</span>}
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Próximos Viajes</p>
                                        {(() => { const nt = (trips as any[]).find(t => t.status === 'UPCOMING'); if (nt) { const d = Math.ceil((new Date(nt.startDate).getTime() - Date.now()) / 86400000); return (<><h3 className="text-xl font-black text-onyx-900 dark:text-white mt-1 line-clamp-1">{nt.destination}</h3><p className={`text-[11px] font-bold mt-1 ${d <= 3 ? 'text-rose-500' : d <= 7 ? 'text-amber-500' : 'text-cyan-500'}`}>{d >= 0 ? `Faltan ${d} día${d !== 1 ? 's' : ''}` : '🏠 En curso'}</p></>); } return (<><h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">{trips.length}</h3><p className="text-[10px] text-onyx-400 dark:text-onyx-500 mt-1.5">planificados</p></>); })()}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 3. Vault Documents */}
                                <div onClick={() => handleNavigate('life', 'life')} className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/15 dark:to-yellow-500/5 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Vault Aliseus</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">{vaultDocuments.length}</h3>
                                        <p className="text-[10px] text-onyx-400 dark:text-onyx-500 mt-1.5">{vaultDocuments.length > 0 ? `${vaultDocuments.length} doc${vaultDocuments.length > 1 ? 's' : ''} protegido${vaultDocuments.length > 1 ? 's' : ''}` : 'Ñade documentos al Vault'}</p>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
                                </div>

                                {/* 4. Tasks Today */}
                                <div className="bg-white dark:bg-onyx-900 p-6 rounded-[2rem] border border-onyx-100 dark:border-onyx-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/15 dark:to-teal-500/5 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-onyx-400 dark:text-onyx-500 text-[10px] font-black uppercase tracking-[0.2em]">Tareas Hoy</p>
                                        <h3 className="text-3xl font-black text-onyx-900 dark:text-white mt-1">{homeAssets.length}</h3>
                                        <p className="text-[10px] text-onyx-400 dark:text-onyx-500 mt-1.5">{homeAssets.length > 0 ? 'activos en casa' : 'Sin activos registrados'}</p>
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

