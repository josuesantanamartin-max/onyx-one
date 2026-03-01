import React, { useMemo, useState, useEffect } from 'react';
import { useFinanceStore } from '../../../store/useFinanceStore';
import { useLifeStore } from '../../../store/useLifeStore';
import { Zap, Sparkles, AlertCircle, Coffee, AlertTriangle, TrendingUp, ShoppingCart } from 'lucide-react';

interface Insight {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
}

const AliseusBrainFeed: React.FC = () => {
    const { transactions = [], debts = [], accounts = [] } = useFinanceStore();
    const { pantryItems = [], shoppingList = [] } = useLifeStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    const insights = useMemo(() => {
        const generated: Insight[] = [];
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // 1. Debt Insight
        const upcomingDebts = debts.filter(d => {
            const dueDay = parseInt(d.dueDate, 10);
            const diff = dueDay - today.getDate();
            return diff >= 0 && diff <= 5;
        });

        if (upcomingDebts.length > 0) {
            const nextDebt = upcomingDebts[0];
            const hasFunds = accounts.some(a => a.balance >= nextDebt.remainingBalance);
            generated.push({
                id: `debt-${nextDebt.id}`,
                title: 'Pago inminente',
                description: `El pago de ${nextDebt.name} (${formatCurrency(nextDebt.remainingBalance)}) es en los próximos días. ${hasFunds ? 'Hay fondos suficientes.' : 'Revisa tus fondos.'}`,
                icon: AlertCircle,
                colorClass: 'text-rose-600 dark:text-rose-400',
                bgClass: 'bg-rose-50 dark:bg-rose-900/30'
            });
        }

        // 2. Spending Insight (Coffee/Restaurants)
        const recentExpenses = transactions.filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'EXPENSE' && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        });

        const coffeeSpending = recentExpenses
            .filter(t => t.category?.toLowerCase().includes('caf') || t.category?.toLowerCase().includes('ocio'))
            .reduce((acc, curr) => acc + curr.amount, 0);

        if (coffeeSpending > 30) {
            generated.push({
                id: 'coffee-spending',
                title: 'Tendencia de gasto',
                description: `Llevas ${formatCurrency(coffeeSpending)} gastados en cafés y ocio este mes. Vigila si esto se alinea con tu presupuesto.`,
                icon: Coffee,
                colorClass: 'text-amber-600 dark:text-amber-400',
                bgClass: 'bg-amber-50 dark:bg-amber-900/30'
            });
        }

        // 3. Pantry / Life Insight
        const lowStock = pantryItems.filter(i => i.quantity <= (i.lowStockThreshold || 0));
        if (lowStock.length > 0) {
            generated.push({
                id: 'pantry-low',
                title: 'Atención en la despensa',
                description: `Tienes ${lowStock.length} producto(s) por debajo del stock mínimo. Es hora de revisar tu lista de la compra.`,
                icon: ShoppingCart,
                colorClass: 'text-emerald-600 dark:text-emerald-400',
                bgClass: 'bg-emerald-50 dark:bg-emerald-900/30'
            });
        }

        // Fallback info if nothing else
        if (generated.length === 0) {
            generated.push({
                id: 'all-good',
                title: 'Todo en orden',
                description: 'Tus finanzas y módulos están estables. No hay alertas críticas por el momento.',
                icon: Sparkles,
                colorClass: 'text-cyan-600 dark:text-cyan-400',
                bgClass: 'bg-cyan-50 dark:bg-cyan-900/30'
            });
        }

        return generated;
    }, [transactions, debts, accounts, pantryItems]);

    // Simple Auto-rotation
    useEffect(() => {
        if (insights.length <= 2) return; // No need to rotate if fits in view
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % (insights.length - 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [insights.length]);

    const visibleInsights = insights.length > 2 ? insights.slice(currentIndex, currentIndex + 2) : insights;

    return (
        <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 dark:from-cyan-900/20 dark:to-teal-900/20 backdrop-blur-xl border border-cyan-200/50 dark:border-cyan-800/50 rounded-[2.5rem] p-6 shadow-sm flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Zap className="w-24 h-24 text-cyan-500" />
            </div>
            <h3 className="text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10 shrink-0">
                <Sparkles className="w-4 h-4" /> Aliseus Brain
            </h3>

            <div className="space-y-4 relative z-10 transition-all duration-500 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {visibleInsights.map((insight) => {
                    const Icon = insight.icon;
                    return (
                        <div key={insight.id} className="p-4 bg-white/70 dark:bg-onyx-900/70 rounded-2xl border border-white/50 dark:border-onyx-800/50 hover:bg-white dark:hover:bg-onyx-900 transition-colors shadow-sm cursor-default">
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-xl ${insight.bgClass} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${insight.colorClass}`} />
                                </div>
                                <div className="flex-1">
                                    <span className="font-bold text-onyx-900 dark:text-white block mb-1 text-sm">{insight.title}</span>
                                    <span className="text-onyx-600 dark:text-onyx-400 text-[13px] leading-snug block">{insight.description}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AliseusBrainFeed;
