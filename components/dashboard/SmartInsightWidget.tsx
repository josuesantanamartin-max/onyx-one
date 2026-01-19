import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useFinanceStore } from '../../store/useFinanceStore';
import { useLifeStore } from '../../store/useLifeStore';
import { generateSmartInsight } from '../../services/geminiService';
import { Lightbulb, ArrowRight, Sparkles, ChefHat } from 'lucide-react';

const SmartInsightWidget: React.FC = () => {
    const { language } = useUserStore();
    const { transactions, currency } = useFinanceStore();
    const { pantryItems } = useLifeStore();

    const [insight, setInsight] = useState<{
        title: string;
        insight: string;
        savingsEstimate: string;
        actionableRecipe?: { name: string; matchReason: string };
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);

        // simple heuristic for top categories
        const expensesByCategory: Record<string, number> = {};
        transactions
            .filter(t => t.type === 'EXPENSE')
            .forEach(t => {
                expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
            });

        const topCategories = Object.entries(expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([cat]) => cat);

        const totalSpend = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
        const pantryNames = pantryItems.map(i => i.name);

        const result = await generateSmartInsight(
            { topCategories, monthlySpending: totalSpend, currency },
            pantryNames,
            language as 'ES' | 'EN' | 'FR'
        );

        if (result) {
            setInsight(result);
        }
        setLoading(false);
    };

    // Auto-generate on mount if not dismissed (could be annoying, maybe manual trigger for now)
    // For "Wow" factor, let's make it manual first but with a flashy "New Insight Available" state

    if (dismissed) return null;

    if (!insight && !loading) {
        return (
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer" onClick={handleGenerate}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">IA Native</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">
                            {language === 'ES' ? 'Análisis Inteligente Disponible' : 'Smart Analysis Available'}
                        </h3>
                        <p className="text-white/80 text-sm max-w-sm">
                            {language === 'ES' ? 'Cruzar datos de Finanzas + Despensa para ahorrar dinero.' : 'Cross-reference Finance + Pantry to save money.'}
                        </p>
                    </div>
                    <div className="bg-white text-indigo-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6" />
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white dark:bg-onyx-900 border border-gray-100 dark:border-onyx-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[160px] animate-pulse">
                <Sparkles className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                <p className="text-sm font-bold text-gray-500">
                    {language === 'ES' ? 'Analizando patrones de gasto...' : 'Analyzing spending patterns...'}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-onyx-900 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 shadow-xl shadow-indigo-500/5 relative overflow-hidden animate-fade-in ring-1 ring-indigo-500/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Onyx Insight</span>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{insight?.title}</h3>
                        </div>
                    </div>
                    <button onClick={() => setDismissed(true)} className="text-gray-300 hover:text-gray-500">&times;</button>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                    {insight?.insight}
                </p>

                {insight?.actionableRecipe && (
                    <div className="bg-gray-50 dark:bg-onyx-800 rounded-2xl p-4 flex items-center gap-4 mb-4">
                        <div className="p-2 bg-white dark:bg-onyx-700 rounded-full shadow-sm">
                            <ChefHat className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{insight.actionableRecipe.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{insight.actionableRecipe.matchReason}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-onyx-800">
                    <div className="text-xs">
                        <span className="text-gray-400">Ahorro est.</span>
                        <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">{insight?.savingsEstimate}</p>
                    </div>
                    <button className="text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                        {language === 'ES' ? 'Ver Detalles' : 'View Details'} <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SmartInsightWidget;
