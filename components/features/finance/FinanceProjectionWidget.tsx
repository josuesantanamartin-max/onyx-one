import React, { useMemo } from 'react';
import { useFinanceStore } from '../../../store/useFinanceStore';
import { useUserStore } from '../../../store/useUserStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const FinanceProjectionWidget = () => {
    const { transactions, accounts } = useFinanceStore();
    const { currency } = useUserStore();

    const currentBalance = useMemo(() => accounts.reduce((acc, curr) => acc + curr.balance, 0), [accounts]);

    // Calculate Average Daily Net Flow (Last 30 Days)
    const projectionData = useMemo(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);

        const income = recentTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
        const expenses = recentTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

        const netFlow = income - expenses;
        const dailyAvg = netFlow / 30;

        // Generate next 30 days
        const data = [];
        let predictedBalance = currentBalance;

        for (let i = 0; i <= 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);

            data.push({
                day: i === 0 ? 'Hoy' : `+${i}d`,
                date: date.toISOString().split('T')[0],
                balance: predictedBalance,
                trend: dailyAvg >= 0 ? 'positive' : 'negative'
            });

            predictedBalance += dailyAvg;
        }

        return { data, dailyAvg };
    }, [transactions, currentBalance]);

    const isPositive = projectionData.dailyAvg >= 0;
    const projectedAmount = projectionData.data[projectionData.data.length - 1].balance;
    const difference = projectedAmount - currentBalance;

    return (
        <div className="bg-white dark:bg-onyx-900 p-6 rounded-3xl border border-gray-100 dark:border-onyx-800 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        Proyección a 30 Días
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Base: Tendencia de los últimos 30 días</p>
                </div>
                <div className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isPositive ? 'Crecimiento' : 'Descenso'}
                </div>
            </div>

            <div className="flex-1 min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionData.data}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9CA3AF' }}
                            interval={6}
                        />
                        <YAxis
                            hide
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                            labelStyle={{ color: '#6B7280', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            formatter={(value: number) => [new Intl.NumberFormat('es-ES', { style: 'currency', currency: currency || 'EUR' }).format(value), 'Balance Estimado']}
                        />
                        <ReferenceLine y={currentBalance} stroke="#E5E7EB" strokeDasharray="3 3" />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke={isPositive ? '#10B981' : '#EF4444'}
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50 dark:border-onyx-800">
                <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Balance Actual</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: currency || 'EUR' }).format(currentBalance)}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Estimado (+30d)</p>
                    <p className={`text-lg font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: currency || 'EUR' }).format(projectedAmount)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FinanceProjectionWidget;
