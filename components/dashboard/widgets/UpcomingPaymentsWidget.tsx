import React, { useMemo } from 'react';
import { DashboardDataProps } from '../WidgetRegistry';
import { getUpcomingPayments, getTotalUpcomingPayments, getUrgentPayments } from '../../../utils/upcomingPayments';
import { Calendar, AlertTriangle, CreditCard, Repeat, DollarSign } from 'lucide-react';

const UpcomingPaymentsWidget: React.FC<DashboardDataProps> = ({
    transactions,
    accounts,
    debts
}) => {
    const upcomingPayments = useMemo(() =>
        getUpcomingPayments(transactions, debts, accounts, 30),
        [transactions, debts, accounts]
    );

    const totalAmount = getTotalUpcomingPayments(upcomingPayments);
    const urgentPayments = getUrgentPayments(upcomingPayments);
    const displayPayments = upcomingPayments.slice(0, 5); // Mostrar solo los próximos 5

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'RECURRING': return Repeat;
            case 'DEBT': return DollarSign;
            case 'CREDIT_CARD': return CreditCard;
            default: return Calendar;
        }
    };

    const getSourceColor = (source: string) => {
        switch (source) {
            case 'RECURRING': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
            case 'DEBT': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
            case 'CREDIT_CARD': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
        }
    };

    return (
        <div className="bg-white dark:bg-onyx-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-onyx-800 hover:shadow-lg transition-all h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
                            Próximos Pagos
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {upcomingPayments.length} pagos pendientes
                        </p>
                    </div>
                </div>
                {urgentPayments.length > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">
                            {urgentPayments.length} urgente{urgentPayments.length > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 mb-6 border border-orange-100 dark:border-orange-900/50">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Total a Pagar (30 días)
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                    {totalAmount.toFixed(2)}€
                </p>
            </div>

            {/* Payments List */}
            <div className="space-y-3 flex-1 overflow-y-auto">
                {displayPayments.length === 0 ? (
                    <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                            No hay pagos próximos
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            ¡Todo al día!
                        </p>
                    </div>
                ) : (
                    displayPayments.map((payment) => {
                        const SourceIcon = getSourceIcon(payment.source);
                        const isUrgent = payment.daysUntilDue <= 3 && payment.daysUntilDue >= 0;
                        const isOverdue = payment.isOverdue;

                        return (
                            <div
                                key={payment.id}
                                className={`p-4 rounded-xl border transition-all hover:shadow-md ${isOverdue
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50'
                                    : isUrgent
                                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900/50'
                                        : 'bg-gray-50 dark:bg-onyx-800 border-gray-200 dark:border-onyx-700'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getSourceColor(payment.source)}`}>
                                            <SourceIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                {payment.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {payment.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right ml-3">
                                        <p className="text-sm font-black text-gray-900 dark:text-white">
                                            {payment.amount.toFixed(2)}€
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {new Date(payment.dueDate).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold ${isOverdue
                                        ? 'text-red-600 dark:text-red-400'
                                        : isUrgent
                                            ? 'text-orange-600 dark:text-orange-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {isOverdue
                                            ? `Vencido hace ${Math.abs(payment.daysUntilDue)} días`
                                            : payment.daysUntilDue === 0
                                                ? 'Hoy'
                                                : payment.daysUntilDue === 1
                                                    ? 'Mañana'
                                                    : `En ${payment.daysUntilDue} días`
                                        }
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Ver más */}
            {upcomingPayments.length > 5 && (
                <button className="w-full mt-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Ver todos ({upcomingPayments.length} pagos)
                </button>
            )}
        </div>
    );
};

export default UpcomingPaymentsWidget;
