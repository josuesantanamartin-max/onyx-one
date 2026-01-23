import { Transaction, Account, Debt, Budget } from '../types';

export interface FinancialHealthScore {
    score: number;
    breakdown: {
        savingsRatio: { score: number; value: number };
        debtRatio: { score: number; value: number };
        emergencyFund: { score: number; value: number };
        budgetCompliance: { score: number; value: number };
        diversification: { score: number; value: number };
    };
    recommendations: string[];
    trend: 'UP' | 'DOWN' | 'STABLE';
    level: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

/**
 * Calcula el score de salud financiera (0-100) basado en múltiples factores
 */
export function calculateFinancialHealth(
    transactions: Transaction[],
    accounts: Account[],
    debts: Debt[],
    budgets: Budget[],
    selectedDate: Date
): FinancialHealthScore {
    const recommendations: string[] = [];

    // Calcular período actual (último mes)
    const now = selectedDate;
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
    });

    // 1. RATIO DE AHORRO (30 puntos): (Ingresos - Gastos) / Ingresos
    const monthlyIncome = monthTransactions
        .filter(t => t.type === 'INCOME' && t.category !== 'Transferencia')
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthTransactions
        .filter(t => t.type === 'EXPENSE' && t.category !== 'Transferencia')
        .reduce((sum, t) => sum + t.amount, 0);

    const savingsAmount = monthlyIncome - monthlyExpenses;
    const savingsRatioValue = monthlyIncome > 0 ? (savingsAmount / monthlyIncome) : 0;

    let savingsScore = 0;
    if (savingsRatioValue >= 0.30) savingsScore = 30; // Excelente: 30%+ ahorro
    else if (savingsRatioValue >= 0.20) savingsScore = 25; // Bueno: 20-30%
    else if (savingsRatioValue >= 0.10) savingsScore = 18; // Aceptable: 10-20%
    else if (savingsRatioValue >= 0) savingsScore = 10; // Bajo: 0-10%
    else savingsScore = 0; // Negativo

    if (savingsRatioValue < 0.20) {
        recommendations.push('Intenta ahorrar al menos el 20% de tus ingresos mensuales');
    }

    // 2. RATIO DE DEUDA (25 puntos): Deudas / Patrimonio Neto
    const totalDebt = debts.reduce((sum, d) => sum + d.remainingBalance, 0);
    const netWorth = accounts.reduce((sum, a) => sum + a.balance, 0) - totalDebt;
    const debtRatioValue = netWorth > 0 ? (totalDebt / netWorth) : 1;

    let debtScore = 0;
    if (debtRatioValue === 0) debtScore = 25; // Sin deudas
    else if (debtRatioValue <= 0.30) debtScore = 20; // Excelente: <30%
    else if (debtRatioValue <= 0.50) debtScore = 15; // Bueno: 30-50%
    else if (debtRatioValue <= 1.0) debtScore = 8; // Aceptable: 50-100%
    else debtScore = 0; // Malo: >100%

    if (debtRatioValue > 0.50) {
        recommendations.push('Tu ratio de deuda es alto. Considera un plan de pago acelerado');
    }

    // 3. FONDO DE EMERGENCIA (20 puntos): Ahorros / (Gastos Mensuales * 6)
    const liquidAssets = accounts
        .filter(a => a.type === 'BANK' || a.type === 'CASH')
        .reduce((sum, a) => sum + a.balance, 0);

    const emergencyTarget = monthlyExpenses * 6;
    const emergencyFundValue = emergencyTarget > 0 ? (liquidAssets / emergencyTarget) : 0;

    let emergencyScore = 0;
    if (emergencyFundValue >= 1.0) emergencyScore = 20; // 6+ meses
    else if (emergencyFundValue >= 0.5) emergencyScore = 15; // 3-6 meses
    else if (emergencyFundValue >= 0.25) emergencyScore = 10; // 1.5-3 meses
    else emergencyScore = 5; // <1.5 meses

    if (emergencyFundValue < 0.5) {
        recommendations.push('Construye un fondo de emergencia de al menos 3-6 meses de gastos');
    }

    // 4. CUMPLIMIENTO DE PRESUPUESTO (15 puntos): % categorías dentro del presupuesto
    let budgetCompliantCategories = 0;
    let totalBudgets = budgets.filter(b => b.period === 'MONTHLY').length;

    if (totalBudgets > 0) {
        budgets.filter(b => b.period === 'MONTHLY').forEach(budget => {
            const categoryExpenses = monthTransactions
                .filter(t =>
                    t.type === 'EXPENSE' &&
                    t.category === budget.category &&
                    (!budget.subCategory || t.subCategory === budget.subCategory)
                )
                .reduce((sum, t) => sum + t.amount, 0);

            if (categoryExpenses <= budget.limit) {
                budgetCompliantCategories++;
            }
        });

        const complianceRate = budgetCompliantCategories / totalBudgets;
        const budgetComplianceValue = complianceRate;

        let budgetScore = Math.round(complianceRate * 15);

        if (complianceRate < 0.70) {
            recommendations.push('Estás excediendo varios presupuestos. Revisa tus gastos');
        }

        var budgetComplianceScore = budgetScore;
    } else {
        var budgetComplianceScore = 10; // Puntos por defecto si no hay presupuestos
        var budgetComplianceValue = 0;
        recommendations.push('Crea presupuestos mensuales para mejorar tu control financiero');
    }

    // 5. DIVERSIFICACIÓN (10 puntos): Número de fuentes de ingreso
    const incomeCategories = new Set(
        monthTransactions
            .filter(t => t.type === 'INCOME' && t.category !== 'Transferencia')
            .map(t => t.category)
    );

    const diversificationValue = incomeCategories.size;
    let diversificationScore = 0;
    if (diversificationValue >= 3) diversificationScore = 10; // 3+ fuentes
    else if (diversificationValue === 2) diversificationScore = 7; // 2 fuentes
    else if (diversificationValue === 1) diversificationScore = 4; // 1 fuente
    else diversificationScore = 0; // Sin ingresos

    if (diversificationValue < 2) {
        recommendations.push('Considera diversificar tus fuentes de ingreso');
    }

    // SCORE TOTAL
    const totalScore = Math.min(100, Math.round(
        savingsScore +
        debtScore +
        emergencyScore +
        budgetComplianceScore +
        diversificationScore
    ));

    // NIVEL
    let level: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    if (totalScore >= 80) level = 'EXCELLENT';
    else if (totalScore >= 60) level = 'GOOD';
    else if (totalScore >= 40) level = 'FAIR';
    else level = 'POOR';

    // TENDENCIA (simplificado - en producción comparar con mes anterior)
    const trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';

    return {
        score: totalScore,
        breakdown: {
            savingsRatio: { score: savingsScore, value: savingsRatioValue },
            debtRatio: { score: debtScore, value: debtRatioValue },
            emergencyFund: { score: emergencyScore, value: emergencyFundValue },
            budgetCompliance: { score: budgetComplianceScore, value: budgetComplianceValue },
            diversification: { score: diversificationScore, value: diversificationValue },
        },
        recommendations: recommendations.slice(0, 3), // Top 3 recomendaciones
        trend,
        level
    };
}

/**
 * Obtiene el color basado en el score
 */
export function getHealthScoreColor(score: number): string {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#3b82f6'; // blue-500
    if (score >= 40) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
}

/**
 * Obtiene el texto del nivel
 */
export function getHealthLevelText(level: string): string {
    const texts = {
        EXCELLENT: 'Excelente',
        GOOD: 'Buena',
        FAIR: 'Regular',
        POOR: 'Necesita Mejora'
    };
    return texts[level as keyof typeof texts] || 'Desconocido';
}
