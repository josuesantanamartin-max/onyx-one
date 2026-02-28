import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, ArrowDownCircle, ArrowUpCircle, ArrowRightLeft,
    ShoppingCart, ScanLine, X
} from 'lucide-react';
import { useUserStore } from '../../../store/useUserStore';
import { QuickActionType } from '../../../types';

/* ─── Action definitions ──────────────────────────────────────────── */
const FINANCE_ACTIONS: { type: QuickActionType; label: string; sub: string; icon: React.ElementType; color: string; bg: string }[] = [
    { type: 'ADD_EXPENSE', label: 'Gasto', sub: 'Registrar un pago', icon: ArrowDownCircle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40' },
    { type: 'ADD_INCOME', label: 'Ingreso', sub: 'Anotar un cobro', icon: ArrowUpCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { type: 'ADD_TRANSFER', label: 'Transferencia', sub: 'Entre mis cuentas', icon: ArrowRightLeft, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/40' },
];

const LIFE_ACTIONS: { type: QuickActionType; label: string; sub: string; icon: React.ElementType; color: string; bg: string }[] = [
    { type: 'ADD_SHOPPING_ITEM', label: 'Lista de compra', sub: 'Añadir producto', icon: ShoppingCart, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/40' },
    { type: 'SCAN_RECEIPT', label: 'Escanear ticket', sub: 'Con IA de Aliseus', icon: ScanLine, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/40' },
];

/* ─── Single action row ───────────────────────────────────────────── */
const ActionRow: React.FC<{
    icon: React.ElementType;
    label: string;
    sub: string;
    color: string;
    bg: string;
    onClick: () => void;
    delay: number;
}> = ({ icon: Icon, label, sub, color, bg, onClick, delay }) => (
    <motion.button
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 16 }}
        transition={{ delay, duration: 0.2 }}
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group"
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} transition-transform group-hover:scale-110`}>
            <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none mb-0.5">{label}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">{sub}</p>
        </div>
    </motion.button>
);

/* ─── Main component ──────────────────────────────────────────────── */
const FloatingActionButton: React.FC = () => {
    const { isFabOpen, setFabOpen, setQuickAction, activeApp, setActiveApp, setFinanceActiveTab, setLifeActiveTab } = useUserStore();

    const triggerAction = (type: QuickActionType) => {
        setQuickAction({ type, timestamp: Date.now() });
        setFabOpen(false);

        if (type === 'ADD_EXPENSE' || type === 'ADD_INCOME' || type === 'ADD_TRANSFER') {
            setActiveApp('finance');
            setFinanceActiveTab('transactions');
        } else if (type === 'SCAN_RECEIPT') {
            setActiveApp('life');
            setLifeActiveTab('kitchen-pantry');
        } else if (type === 'ADD_SHOPPING_ITEM') {
            setActiveApp('life');
            setLifeActiveTab('kitchen-list');
        }
    };

    const showFinance = activeApp === 'finance' || activeApp === 'dashboard' || activeApp === 'settings';
    const showLife = activeApp === 'life' || activeApp === 'dashboard' || activeApp === 'settings';

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isFabOpen && (
                    <motion.div
                        key="fab-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={() => setFabOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Floating panel + button */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">

                {/* Action panel */}
                <AnimatePresence>
                    {isFabOpen && (
                        <motion.div
                            key="fab-panel"
                            initial={{ opacity: 0, scale: 0.92, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 12 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            className="w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 dark:border-white/10 overflow-hidden"
                            style={{ transformOrigin: 'bottom right' }}
                        >
                            {/* Header */}
                            <div className="px-5 pt-5 pb-3 flex flex-col items-center justify-center border-b border-gray-50 dark:border-white/5 relative bg-gradient-to-br from-cyan-50/50 to-white dark:from-cyan-950/20 dark:to-gray-900">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 relative z-10">Accionador</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 relative z-10">¿Qué quieres registrar?</p>
                            </div>

                            <div className="p-2">
                                {/* Finance section */}
                                {showFinance && (
                                    <>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-300 dark:text-gray-600 px-3 pt-2 pb-1">Finanzas</p>
                                        {FINANCE_ACTIONS.map((a, i) => (
                                            <ActionRow key={a.type} {...a} onClick={() => triggerAction(a.type)} delay={i * 0.04} />
                                        ))}
                                    </>
                                )}

                                {/* Divider */}
                                {showFinance && showLife && (
                                    <div className="mx-3 my-1 border-t border-gray-100 dark:border-white/5" />
                                )}

                                {/* Life section */}
                                {showLife && (
                                    <>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-300 dark:text-gray-600 px-3 pt-2 pb-1">Vida</p>
                                        {LIFE_ACTIONS.map((a, i) => (
                                            <ActionRow key={a.type} {...a} onClick={() => triggerAction(a.type)} delay={(FINANCE_ACTIONS.length + i) * 0.04} />
                                        ))}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main FAB button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFabOpen(!isFabOpen)}
                    className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative z-50
                        ${isFabOpen
                            ? 'bg-white dark:bg-gray-800 shadow-2xl'
                            : 'bg-gradient-to-br from-cyan-500 to-teal-500 shadow-custom shadow-cyan-500/20 hover:shadow-cyan-500/40'}
                    `}
                >
                    <motion.div
                        animate={{ rotate: isFabOpen ? 90 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="flex items-center justify-center"
                    >
                        {isFabOpen ? (
                            <X className="w-6 h-6 text-gray-400" />
                        ) : (
                            <Plus className="w-6 h-6 text-white" />
                        )}
                    </motion.div>

                    {/* Glow ring when closed */}
                    {!isFabOpen && (
                        <span className="absolute inset-0 rounded-2xl ring-2 ring-cyan-500/20 animate-pulse pointer-events-none" />
                    )}
                </motion.button>
            </div>
        </>
    );
};

export default FloatingActionButton;
