import React, { useState, useMemo } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { useUserStore } from '../../store/useUserStore';
import { useLifeStore } from '../../store/useLifeStore';
import {
    Settings, Coffee, Sunset, Moon, Search, LayoutGrid, CalendarRange, Wallet,
    TrendingUp, Target, Receipt, CreditCard, ShoppingBag, Utensils, Heart, PiggyBank, Home,
    Activity, Clock, CalendarDays, LineChart, PieChart, ShieldCheck, Map, ClipboardList, AlertTriangle, BookOpen, Layers, ShoppingCart
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
    morning: { text: 'Buenos días', sub: 'Comienza el día con claridad.', icon: Coffee },
    afternoon: { text: 'Buenas tardes', sub: 'Mantén el ritmo.', icon: Sunset },
    evening: { text: 'Buenas noches', sub: 'Revisa tus logros de hoy.', icon: Moon },
};

const BentoDashboard: React.FC = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    // State to track which widget is inline-expanded. Null = none.
    const [expandedWidgetId, setExpandedWidgetId] = useState<string | null>(null);

    const {
        dashboardLayouts, activeLayoutId, isEditMode,
        setEditMode, saveLayout,
        setActiveApp, setFinanceActiveTab, setLifeActiveTab,
        theme, setTheme, hasCompletedOnboarding,
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
        familyMembers = []
    } = useLifeStore();

    const [timeMode, setTimeMode] = useState<'MONTH' | 'YEAR'>('MONTH');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Tour - kept from original
    React.useEffect(() => {
        const hasSeenTour = localStorage.getItem('onyx_has_seen_tour');
        if (hasCompletedOnboarding && !hasSeenTour) {
            setTimeout(() => {
                import('./DashboardTour').then(mod => mod.startDashboardTour());
                localStorage.setItem('onyx_has_seen_tour', 'true');
            }, 1000);
        }
    }, [hasCompletedOnboarding]);

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

    // Group active widgets by logical sections automatically referencing WIDGET_CONFIG category
    const financeCoreWidgets = activeWidgetIds.filter(id => getWidgetCategory(id) === 'FINANCE' && ['NET_WORTH', 'MONTHLY_FLOW', 'SAVINGS_RATE', 'ANNUAL_COMPARISON'].includes(id));
    const financeDetailWidgets = activeWidgetIds.filter(id => getWidgetCategory(id) === 'FINANCE' && !['NET_WORTH', 'MONTHLY_FLOW', 'SAVINGS_RATE', 'ANNUAL_COMPARISON'].includes(id));
    const lifeWidgets = activeWidgetIds.filter(id => getWidgetCategory(id) === 'LIFE');

    // Full Widget renderer
    const renderFullWidget = (widgetId: string) => {
        const WidgetComponent = WIDGET_REGISTRY[widgetId];
        if (!WidgetComponent) {
            return <p>Widget "{widgetId}" no encontrado en el registro.</p>;
        }
        return <WidgetComponent {...widgetProps} />;
    };

    if (!activeLayout) return <div className="p-10 text-center text-onyx-400">No layout selected</div>;

    return (
        <div className="h-full bg-onyx-50/30 dark:bg-onyx-950/30 overflow-y-auto custom-scrollbar relative">
            <SampleDataBanner />

            {/* ── Top Bar (Sticky Focus) ─────────────────────────────────── */}
            <div className="sticky top-0 z-30 px-6 md:px-10 py-4 bg-white/80 dark:bg-onyx-950/80 backdrop-blur-xl border-b border-onyx-100/50 dark:border-onyx-800/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 shrink-0">
                        <greeting.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 hidden sm:block">
                        <h1 className="text-lg font-black text-onyx-900 dark:text-white tracking-tight leading-none truncate">
                            {greeting.text}
                        </h1>
                        <p className="text-xs text-onyx-500 dark:text-onyx-400 mt-1 truncate font-medium">
                            {greeting.sub}
                        </p>
                    </div>
                </div>

                {/* Center / Right: actions & Theme */}
                <div className="flex items-center gap-1.5 shrink-0 bg-white/50 dark:bg-onyx-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-onyx-100 dark:border-onyx-800">
                    <Button variant="ghost" onClick={() => setIsSearchOpen(true)} className="p-2.5 rounded-xl hover:bg-onyx-100 dark:hover:bg-onyx-800">
                        <Search className="w-4 h-4 text-onyx-600 dark:text-onyx-400" />
                    </Button>
                    <div className="w-px h-6 bg-onyx-200 dark:bg-onyx-700 mx-1"></div>
                    <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl hover:bg-onyx-100 dark:hover:bg-onyx-800">
                        {theme === 'dark' ? <Sunset className="w-4 h-4 text-onyx-400" /> : <Moon className="w-4 h-4 text-onyx-600" />}
                    </Button>
                    <div className="w-px h-6 bg-onyx-200 dark:bg-onyx-700 mx-1"></div>

                    <LayoutSelector />
                    {!isEditMode ? (
                        <Button
                            variant="primary"
                            id="edit-mode-btn"
                            onClick={() => {
                                setEditMode(true);
                                setIsGalleryOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px]"
                        >
                            <Settings className="w-3.5 h-3.5" />
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

            <AnimatedList className="px-6 md:px-10 py-8 max-w-[1600px] mx-auto" staggerDelay={0.1}>

                {/* ─ Bento Section: Resumen Financiero ─ */}
                {financeCoreWidgets.length > 0 && (
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

                {/* ─ Bento Section: Control Financiero ─ */}
                {(financeDetailWidgets.length > 0 || isEditMode) && (
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

                {/* ─ Bento Section: Vida y Hogar ─ */}
                {(lifeWidgets.length > 0 || isEditMode) && (
                    <AnimatedListItem>
                        <BentoSection id="life" title="Vida & Hogar" icon={<Home className="w-5 h-5" />}>
                            {lifeWidgets.map(id => {
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
