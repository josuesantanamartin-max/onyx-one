import React from 'react';
import { Transaction, Account, Debt } from '../../../../../types';
import NetWorthSparkline from '../../../../dashboard/charts/NetWorthSparkline';

interface NetWorthCardProps {
    accounts: Account[];
    debts: Debt[];
    monthlyIncome: number;
    monthlyExpenses: number;
    transactions: Transaction[];
    onNavigate: (app: string, tab?: string) => void;
}

const formatEUR = (amount: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const NetWorthCard: React.FC<NetWorthCardProps> = ({ accounts, debts, transactions, onNavigate }) => {
    const totalAssets = accounts.filter(a => a.type !== 'CREDIT').reduce((acc, curr) => acc + curr.balance, 0);
    const totalLiabilities = accounts.filter(a => a.type === 'CREDIT').reduce((acc, curr) => acc + Math.abs(curr.balance), 0);
    const totalDebtBalance = debts.reduce((acc, d) => acc + d.remainingBalance, 0);
    const totalDebt = totalLiabilities + totalDebtBalance;

    const netWorth = totalAssets - totalDebt;

    // Simulate history for the sparkline (in a real app, this would come from a history table/API)
    // We generate 30 days of synthetic data blending current net worth and recent transaction flow
    const history = React.useMemo(() => {
        const data = [];
        let runningNetWorth = netWorth;
        const now = new Date();

        // Sum up transactions per day to walk backwards in net worth
        const txByDay = transactions.reduce((acc, tx) => {
            const dateStr = new Date(tx.date).toISOString().split('T')[0];
            acc[dateStr] = (acc[dateStr] || 0) + (tx.type === 'INCOME' ? tx.amount : -tx.amount);
            return acc;
        }, {} as Record<string, number>);

        for (let i = 0; i < 30; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            // Reverse the day's flow to find yesterday's net worth
            const dayFlow = txByDay[dateStr] || 0;
            runningNetWorth -= dayFlow; // Walk backwards

            data.unshift({
                date: d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                value: runningNetWorth
            });
        }
        return data;
    }, [netWorth, transactions]);

    const startValue = history[0]?.value || 0;
    const endValue = history[history.length - 1]?.value || 0;
    const trendValue = endValue - startValue;
    const isUp = trendValue >= 0;

    return (
        <div
            className="flex flex-col h-full w-full group cursor-pointer"
            onClick={() => onNavigate('finance', 'dashboard')}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-3xl font-black text-cyan-900 dark:text-white tracking-tight leading-none">
                        {formatEUR(netWorth)}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${isUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'}`}>
                            {isUp ? '↑' : '↓'} {formatEUR(Math.abs(trendValue))} (30d)
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[60px] mt-2 relative">
                <div className="absolute inset-0 -ml-2">
                    <NetWorthSparkline data={history} height={60} color={isUp ? '#10b981' : '#f43f5e'} />
                </div>
            </div>
        </div>
    );
};

export default NetWorthCard;
