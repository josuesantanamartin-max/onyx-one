import React, { useMemo } from 'react';
import { DashboardDataProps } from '../WidgetRegistry';
import { BarChart3, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AnnualComparisonWidget: React.FC<DashboardDataProps> = ({
    transactions,
    selectedDate
}) => {
    const comparisonData = useMemo(() => {
        const currentYear = selectedDate.getFullYear();
        const previousYear = currentYear - 1;

        // Transacciones del año actual
        const currentYearTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === currentYear;
        });

        // Transacciones del año anterior
        const previousYearTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === previousYear;
        });

        // Calcular ingresos
        const currentIncome = currentYearTransactions
            .filter(t => t.type === 'INCOME' && t.category !== 'Transferencia')
            .reduce((sum, t) => sum + t.amount, 0);

        const previousIncome = previousYearTransactions
            .filter(t => t.type === 'INCOME' && t.category !== 'Transferencia')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calcular gastos
        const currentExpenses = currentYearTransactions
            .filter(t => t.type === 'EXPENSE' && t.category !== 'Transferencia')
            .reduce((sum, t) => sum + t.amount, 0);

        const previousExpenses = previousYearTransactions
            .filter(t => t.type === 'EXPENSE' && t.category !== 'Transferencia')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calcular ahorro
        const currentSavings = currentIncome - currentExpenses;
        const previousSavings = previousIncome - previousExpenses;

        // Calcular variaciones
        const incomeChange = previousIncome > 0
            ? ((currentIncome - previousIncome) / previousIncome) * 100
            : 0;

        const expensesChange = previousExpenses > 0
            ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
            : 0;

        const savingsChange = previousSavings !== 0
            ? ((currentSavings - previousSavings) / Math.abs(previousSavings)) * 100
            : 0;

        return {
            currentYear,
            previousYear,
            current: {
                income: currentIncome,
                expenses: currentExpenses,
                savings: currentSavings
            },
            previous: {
                income: previousIncome,
                expenses: previousExpenses,
                savings: previousSavings
            },
            changes: {
                income: incomeChange,
                expenses: expensesChange,
                savings: savingsChange
            }
        };
    }, [transactions, selectedDate]);

    const { currentYear, previousYear, current, previous, changes } = comparisonData;

    // Calcular altura de barras (normalizado al valor máximo)
    const maxValue = Math.max(
        current.income,
        previous.income,
        current.expenses,
        previous.expenses
    );

    return (
        <div className="bg-white dark:bg-onyx-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-onyx-800 hover:shadow-lg transition-all h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
                            Comparativa Anual
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {currentYear} vs {previousYear}
                        </p>
                    </div>
                </div>
            </div>

            {/* Comparison Bars */}
            <div className="space-y-6 mb-6">
                {/* Ingresos */}
                <ComparisonBar
                    label="Ingresos"
                    currentValue={current.income}
                    previousValue={previous.income}
                    change={changes.income}
                    maxValue={maxValue}
                    color="green"
                    positiveIsGood={true}
                />

                {/* Gastos */}
                <ComparisonBar
                    label="Gastos"
                    currentValue={current.expenses}
                    previousValue={previous.expenses}
                    change={changes.expenses}
                    maxValue={maxValue}
                    color="red"
                    positiveIsGood={false}
                />
            </div>

            {/* Savings Summary */}
            <div className={`rounded-xl p-4 border ${current.savings >= 0
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50'
                }`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Ahorro Neto {currentYear}
                    </span>
                    <ChangeIndicator value={changes.savings} />
                </div>
                <p className={`text-2xl font-black ${current.savings >= 0
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                    }`}>
                    {current.savings.toFixed(2)}€
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    vs {previous.savings.toFixed(2)}€ en {previousYear}
                </p>
            </div>
        </div>
    );
};

// Componente auxiliar para barras de comparación
const ComparisonBar: React.FC<{
    label: string;
    currentValue: number;
    previousValue: number;
    change: number;
    maxValue: number;
    color: 'green' | 'red';
    positiveIsGood: boolean;
}> = ({ label, currentValue, previousValue, change, maxValue, color, positiveIsGood }) => {
    const currentPercentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
    const previousPercentage = maxValue > 0 ? (previousValue / maxValue) * 100 : 0;

    const colorClasses = {
        green: 'bg-green-500',
        red: 'bg-red-500'
    };

    const isPositiveChange = change > 0;
    const isGoodChange = positiveIsGood ? isPositiveChange : !isPositiveChange;

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span>
                <ChangeIndicator value={change} isGood={isGoodChange} />
            </div>

            <div className="space-y-2">
                {/* Año actual */}
                <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">2026</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                            {currentValue.toFixed(2)}€
                        </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-onyx-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
                            style={{ width: `${currentPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Año anterior */}
                <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">2025</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                            {previousValue.toFixed(2)}€
                        </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-onyx-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${colorClasses[color]} opacity-50 rounded-full transition-all duration-500`}
                            style={{ width: `${previousPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente auxiliar para indicador de cambio
const ChangeIndicator: React.FC<{ value: number; isGood?: boolean }> = ({ value, isGood }) => {
    const isPositive = value > 0;
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

    // Si no se especifica isGood, usar verde para positivo y rojo para negativo
    const color = isGood !== undefined
        ? isGood ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        : isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

    if (value === 0) {
        return <span className="text-xs font-bold text-gray-500">0%</span>;
    }

    return (
        <div className={`flex items-center gap-1 ${color}`}>
            <Icon className="w-3 h-3" />
            <span className="text-xs font-bold">
                {Math.abs(value).toFixed(1)}%
            </span>
        </div>
    );
};

export default AnnualComparisonWidget;

