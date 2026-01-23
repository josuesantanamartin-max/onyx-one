import React, { useMemo } from 'react';
import { DashboardDataProps } from '../WidgetRegistry';
import { Target, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const MonthlyGoalsWidget: React.FC<DashboardDataProps> = ({
    goals,
    selectedDate
}) => {
    const monthlyGoalsData = useMemo(() => {
        const now = selectedDate;
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Filtrar metas que tienen deadline en el mes actual
        const monthlyGoals = goals.filter(goal => {
            if (!goal.deadline) return false;
            const deadline = new Date(goal.deadline);
            return deadline >= monthStart && deadline <= monthEnd;
        });

        // Calcular progreso y proyección para cada meta
        return monthlyGoals.map(goal => {
            const progress = goal.targetAmount > 0
                ? (goal.currentAmount / goal.targetAmount) * 100
                : 0;

            const remaining = goal.targetAmount - goal.currentAmount;
            const deadline = new Date(goal.deadline!);
            const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const daysPassed = now.getDate();
            const expectedProgress = (daysPassed / daysInMonth) * 100;

            // Determinar si está en ritmo
            const isOnTrack = progress >= expectedProgress;
            const isCompleted = progress >= 100;
            const isAtRisk = !isCompleted && daysRemaining <= 5 && progress < 80;

            // Proyección de cumplimiento
            const dailyRate = daysPassed > 0 ? goal.currentAmount / daysPassed : 0;
            const projectedAmount = dailyRate * daysInMonth;
            const willComplete = projectedAmount >= goal.targetAmount;

            return {
                ...goal,
                progress,
                remaining,
                daysRemaining,
                isOnTrack,
                isCompleted,
                isAtRisk,
                willComplete,
                projectedAmount
            };
        });
    }, [goals, selectedDate]);

    const completedGoals = monthlyGoalsData.filter(g => g.isCompleted).length;
    const totalGoals = monthlyGoalsData.length;

    return (
        <div className="bg-white dark:bg-onyx-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-onyx-800 hover:shadow-lg transition-all h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
                            Objetivos del Mes
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {completedGoals} de {totalGoals} completados
                        </p>
                    </div>
                </div>
                {totalGoals > 0 && (
                    <div className="text-right">
                        <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            {Math.round((completedGoals / totalGoals) * 100)}%
                        </p>
                    </div>
                )}
            </div>

            {/* Goals List */}
            <div className="space-y-4 flex-1 overflow-y-auto">
                {monthlyGoalsData.length === 0 ? (
                    <div className="text-center py-8">
                        <Target className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                            No hay metas para este mes
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Crea metas con deadline en el mes actual
                        </p>
                    </div>
                ) : (
                    monthlyGoalsData.map((goal) => (
                        <div
                            key={goal.id}
                            className={`p-4 rounded-xl border transition-all ${goal.isCompleted
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50'
                                : goal.isAtRisk
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50'
                                    : 'bg-gray-50 dark:bg-onyx-800 border-gray-200 dark:border-onyx-700'
                                }`}
                        >
                            {/* Goal Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-2 flex-1">
                                    {goal.isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    ) : goal.isAtRisk ? (
                                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                    ) : (
                                        <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {goal.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="w-3 h-3 text-gray-400" />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {goal.daysRemaining > 0
                                                    ? `${goal.daysRemaining} días restantes`
                                                    : goal.daysRemaining === 0
                                                        ? 'Último día'
                                                        : 'Vencido'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right ml-3">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {goal.currentAmount.toFixed(0)}€
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        / {goal.targetAmount.toFixed(0)}€
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-2">
                                <div className="h-2 bg-gray-200 dark:bg-onyx-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${goal.isCompleted
                                            ? 'bg-green-500'
                                            : goal.isAtRisk
                                                ? 'bg-red-500'
                                                : goal.isOnTrack
                                                    ? 'bg-indigo-500'
                                                    : 'bg-orange-500'
                                            }`}
                                        style={{ width: `${Math.min(100, goal.progress)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between text-xs">
                                <span className={`font-bold ${goal.isCompleted
                                    ? 'text-green-600 dark:text-green-400'
                                    : goal.isAtRisk
                                        ? 'text-red-600 dark:text-red-400'
                                        : goal.isOnTrack
                                            ? 'text-indigo-600 dark:text-indigo-400'
                                            : 'text-orange-600 dark:text-orange-400'
                                    }`}>
                                    {goal.isCompleted
                                        ? '¡Completado!'
                                        : goal.isAtRisk
                                            ? 'En riesgo'
                                            : goal.isOnTrack
                                                ? 'En buen ritmo'
                                                : 'Necesita impulso'
                                    }
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {goal.progress.toFixed(0)}%
                                </span>
                            </div>

                            {/* Projection */}
                            {!goal.isCompleted && (
                                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Proyección: {goal.projectedAmount.toFixed(0)}€
                                        {goal.willComplete ? (
                                            <span className="text-green-600 dark:text-green-400 ml-1">✓ Se cumplirá</span>
                                        ) : (
                                            <span className="text-orange-600 dark:text-orange-400 ml-1">
                                                ⚠ Falta {(goal.targetAmount - goal.projectedAmount).toFixed(0)}€
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MonthlyGoalsWidget;

