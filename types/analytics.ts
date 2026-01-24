export interface Forecast {
    date: string;
    amount: number;
    confidence: number; // 0-1
    modelUsed: 'LINEAR' | 'MOVING_AVERAGE' | 'AI';
}

export interface Anomaly {
    id: string; // Transaction ID
    date: string;
    amount: number;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    reason: string;
}

export interface SavingOpportunity {
    category: string;
    potentialSavings: number;
    suggestion: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface CashFlowProjection {
    weeks: {
        weekStarting: string;
        income: number;
        expenses: number;
        net: number;
    }[];
    minBalance: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SpendingPattern {
    type: 'SEASONAL' | 'RECURRING' | 'SPIKE';
    description: string;
    frequency?: string;
    detectedCategories: string[];
}
