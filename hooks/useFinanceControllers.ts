// Logic extracted from App.tsx to manage complex interactions between stores
import { useFinanceStore } from '../store/useFinanceStore';
import { useUserStore } from '../store/useUserStore';
import { syncService } from '../services/syncService';
import { Transaction, Trip, Goal } from '../types';

export const useFinanceControllers = () => {
    const {
        transactions, accounts, goals,
        setTransactions, setAccounts, setGoals
    } = useFinanceStore();

    const { automationRules, addSyncLog } = useUserStore();

    const runAutomation = (trigger: string, payload: any) => {
        automationRules.filter(r => r.trigger === trigger && r.isActive).forEach(rule => {
            if (trigger === 'TRANSACTION_OVER_AMOUNT') {
                const tx = payload as Transaction;
                if (rule.threshold && tx.amount > rule.threshold) {
                    if (rule.action === 'SEND_ALERT') {
                        addSyncLog({ message: `⚠️ Alerta Automática: Gasto de ${tx.amount}€ supera el límite de ${rule.threshold}€`, timestamp: Date.now(), type: 'SYSTEM' });
                    }
                }
            }
            // Other rules...
        });
    };

    const addTransaction = async (newTransaction: Omit<Transaction, 'id'> & { id?: string }, isSync = false) => {
        const transaction: Transaction = {
            ...newTransaction,
            id: newTransaction.id || Math.random().toString(36).substr(2, 9)
        };

        if (transaction.type === 'EXPENSE') runAutomation('TRANSACTION_OVER_AMOUNT', transaction);

        setTransactions((prev) => [transaction, ...prev]);

        // Sync to cloud
        try {
            await syncService.saveTransaction(transaction);
        } catch (e) {
            console.error("Failed to sync new transaction:", e);
        }

        const selectedAccount = accounts.find(a => a.id === transaction.accountId);
        if (selectedAccount) {
            const amountImpact = transaction.type === 'INCOME' ? transaction.amount : -transaction.amount;
            setAccounts((prev) => prev.map(acc => {
                if (selectedAccount.type === 'DEBIT' && selectedAccount.linkedAccountId && acc.id === selectedAccount.linkedAccountId) {
                    return { ...acc, balance: acc.balance + amountImpact };
                }
                if (acc.id === transaction.accountId) {
                    return { ...acc, balance: acc.balance + amountImpact };
                }
                return acc;
            }));

            // Sync updated account balance
            if (selectedAccount) {
                const updatedAcc = { ...selectedAccount, balance: selectedAccount.balance + amountImpact };
                syncService.saveAccount(updatedAcc).catch(e => console.error("Failed to sync account balance:", e));
            }
        }

        if (isSync) addSyncLog({ message: `Gasto sincronizado: ${newTransaction.description} (${newTransaction.amount}€)`, timestamp: Date.now(), type: "FINANCE" });
        else {
            const recurrentMsg = transaction.isRecurring ? ` (Recurrente: ${transaction.frequency || 'Mensual'})` : '';
            addSyncLog({ message: `Nueva transacción registrada${recurrentMsg}`, timestamp: Date.now(), type: "FINANCE" });
        }
    };

    const transfer = async (fromAccountId: string, toAccountId: string, amount: number, date: string, goalId?: string, description?: string) => {
        const fromAccount = accounts.find(a => a.id === fromAccountId);
        const toAccount = accounts.find(a => a.id === toAccountId);
        if (!fromAccount || !toAccount) return;

        const outgoing: Transaction = { id: Math.random().toString(36).substr(2, 9), type: 'EXPENSE', amount, date, category: 'Transferencia', subCategory: 'Entre Cuentas', accountId: fromAccountId, description: description || `Transferencia a ${toAccount.name}` };
        const incoming: Transaction = { id: Math.random().toString(36).substr(2, 9), type: 'INCOME', amount, date, category: 'Transferencia', subCategory: 'Desde otra cuenta', accountId: toAccountId, description: description || `Recibido de ${fromAccount.name}` };

        setTransactions((prev) => [incoming, outgoing, ...prev]);

        // Sync transfers
        try {
            await Promise.all([
                syncService.saveTransaction(outgoing),
                syncService.saveTransaction(incoming)
            ]);
        } catch (err: any) {
            console.error("Failed to sync transfer transactions:", err);
        }

        setAccounts((prev) => prev.map(acc => {
            if (acc.id === fromAccountId) {
                const updated = { ...acc, balance: acc.balance - amount };
                syncService.saveAccount(updated).catch((err: any) => console.error("Failed to sync account:", err));
                return updated;
            }
            if (acc.id === toAccountId) {
                const updated = { ...acc, balance: acc.balance + amount };
                syncService.saveAccount(updated).catch((err: any) => console.error("Failed to sync account:", err));
                return updated;
            }
            return acc;
        }));

        if (goalId) {
            const goal = goals.find(g => g.id === goalId);
            if (goal) {
                const updatedGoal = { ...goal, currentAmount: goal.currentAmount + amount };
                setGoals((prev) => prev.map(g => g.id === goalId ? updatedGoal : g));
                syncService.saveGoal(updatedGoal).catch((err: any) => console.error("Failed to sync goal:", err));
                addSyncLog({ message: `Meta actualizada: ${goal.name} (+${amount}€)`, timestamp: Date.now(), type: "FINANCE" });
            }
        }
        addSyncLog({ message: `Traspaso exitoso: ${amount}€ de ${fromAccount.name} a ${toAccount.name}`, timestamp: Date.now(), type: "FINANCE" });
    };

    const editTransaction = async (updatedTransaction: Transaction) => {
        const oldTransaction = transactions.find(t => t.id === updatedTransaction.id);
        if (!oldTransaction) return;

        // Revert old balance and apply new
        setAccounts((prev) => prev.map(acc => {
            let newBalance = acc.balance;
            let changed = false;
            if (acc.id === oldTransaction.accountId) {
                newBalance -= (oldTransaction.type === 'INCOME' ? oldTransaction.amount : -oldTransaction.amount);
                changed = true;
            }
            if (acc.id === updatedTransaction.accountId) {
                newBalance += (updatedTransaction.type === 'INCOME' ? updatedTransaction.amount : -updatedTransaction.amount);
                changed = true;
            }
            if (changed) {
                const updatedAcc = { ...acc, balance: newBalance };
                syncService.saveAccount(updatedAcc).catch(err => console.error("Failed to sync account:", err));
                return updatedAcc;
            }
            return acc;
        }));

        setTransactions((prev) => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
        syncService.saveTransaction(updatedTransaction).catch((err: any) => console.error("Failed to sync transaction:", err));

        addSyncLog({ message: `Transacción actualizada: ${updatedTransaction.description}`, timestamp: Date.now(), type: "FINANCE" });
    };

    const deleteTransaction = async (id: string) => {
        const transaction = transactions.find(t => t.id === id);
        if (!transaction) return;

        setAccounts((prev) => prev.map(acc => {
            if (acc.id === transaction.accountId) {
                const updated = { ...acc, balance: acc.balance - (transaction.type === 'INCOME' ? transaction.amount : -transaction.amount) };
                syncService.saveAccount(updated).catch((err: any) => console.error("Failed to sync account:", err));
                return updated;
            }
            return acc;
        }));
        setTransactions((prev) => prev.filter(t => t.id !== id));
        syncService.deleteTransaction(id).catch((err: any) => console.error("Failed to sync deletion:", err));

        addSyncLog({ message: `Transacción eliminada: ${transaction.description}`, timestamp: Date.now(), type: "FINANCE" });
    };

    return {
        addTransaction,
        transfer,
        editTransaction,
        deleteTransaction
    };
};
