
export type TransactionType = 'INCOME' | 'EXPENSE';
export type Language = 'ES' | 'EN' | 'FR';
export type UserPersona = 'STUDENT' | 'FREELANCER' | 'PROFESSIONAL' | 'FAMILY' | 'ENTREPRENEUR';
export type QuickActionType = 'ADD_EXPENSE' | 'ADD_INCOME' | 'ADD_TRANSFER' | 'ADD_INGREDIENT' | 'ADD_SHOPPING_ITEM' | 'SCAN_RECEIPT' | 'ADD_TASK';

export interface QuickAction {
  type: QuickActionType;
  timestamp: number;
}

export interface CategoryStructure {
  id: string;
  name: string;
  subCategories: string[];
  color?: string;
  icon?: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: string;
  subCategory?: string;
  accountId: string;
  description: string;
  isRecurring?: boolean;
  frequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'YEARLY';
  notes?: string;
}

export interface Account {
  id: string;
  name: string;
  bankName?: string;
  type: 'BANK' | 'INVESTMENT' | 'CASH' | 'CREDIT' | 'DEBIT' | 'WALLET' | 'ASSET';
  balance: number;
  currency: 'EUR' | 'USD' | 'GBP';
  isRemunerated?: boolean;
  tae?: number;
  creditLimit?: number;
  cutoffDay?: number;
  paymentDay?: number;
  linkedAccountId?: string;
  cadastralReference?: string;
  cadastralData?: CadastralData;
}

export interface CadastralData {
  referencia: string;
  superficie?: number;
  añoConstruccion?: number;
  uso?: string;
  localizacion?: {
    bloque?: string;
    escalera?: string;
    planta?: string;
    puerta?: string;
  };
  lastUpdated?: string;
}

export interface Budget {
  id: string;
  category: string;
  subCategory?: string;
  limit: number;
  period: 'MONTHLY' | 'YEARLY' | 'CUSTOM';
  budgetType: 'FIXED' | 'PERCENTAGE';
  percentage?: number;
  startDate?: string;
  endDate?: string;
}

export interface DebtPayment {
  id: string;
  date: string;
  amount: number;
}

export interface Debt {
  id: string;
  name: string;
  type: 'MORTGAGE' | 'LOAN' | 'CREDIT_CARD';
  originalAmount: number;
  remainingBalance: number;
  interestRate: number;
  minPayment: number;
  dueDate: string; // Day of month for payment
  startDate?: string; // Loan start date
  endDate?: string;   // Loan maturity date
  accountId?: string;
  payments: DebtPayment[];
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  accountId?: string;
  linkedTripId?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'pcs' | 'cda' | 'cdta' | 'pizca' | 'manojo' | 'rebanada' | 'loncha' | 'dientes' | string;
  category: 'Vegetables' | 'Fruits' | 'Dairy' | 'Meat' | 'Pantry' | 'Spices' | 'Frozen' | 'Other';
  expiryDate?: string;
  lowStockThreshold?: number;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  prepTime: number;
  calories: number;
  tags: string[];
  rating: number;
  baseServings: number;
  image?: string;
  courseType?: 'STARTER' | 'MAIN' | 'DESSERT' | 'SIDE' | 'DRINK';
  ingredients: RecipeIngredient[];
  instructions: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  category?: string;
  source?: {
    type: 'MANUAL' | 'RECIPE' | 'SMART_PLAN';
    recipeName?: string;
  };
  estimatedPrice?: number; // Precio estimado por unidad en EUR
}

export interface Flight {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  flightNumber: string;
  price: number;
  bookingUrl?: string;
}

export interface Accommodation {
  id: string;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  price: number;
  bookingUrl?: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  activity: string;
  location?: string;
  type: 'ACTIVITY' | 'FOOD' | 'TRANSPORT';
}

export interface Trip {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  status: 'UPCOMING' | 'CURRENT' | 'COMPLETED';
  image: string;
  flights: Flight[];
  accommodations: Accommodation[];
  itinerary: ItineraryItem[];
  linkedGoalId?: string;
}

export interface GrowthRecord {
  date: string;
  height: number;
  weight: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string; // 'Mother', 'Father', 'Son', 'Daughter', etc.
  role: 'PARENT' | 'CHILD' | 'MEMBER';
  avatar: string;
  balance: number;
  weeklyAllowance: number;
  birthDate?: string;
  email?: string;
  phone?: string;
  isEmergencyContact?: boolean;
  growthHistory: GrowthRecord[];
}

export interface Chore {
  id: string;
  title: string;
  reward: number;
  assignedTo: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED';
  recurrence: 'DAILY' | 'WEEKLY';
  icon?: string;
}

export type MealTime = 'breakfast' | 'lunch' | 'dinner';

export type WeeklyPlanState = Record<string, {
  breakfast: Recipe[];
  lunch: Recipe[];
  dinner: Recipe[];
}>;

// --- AUTOMATION & WIDGETS ---

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'TRANSACTION_OVER_AMOUNT' | 'TRIP_CREATED';
  threshold?: number; // Used for TRANSACTION_OVER_AMOUNT
  action: 'SEND_ALERT' | 'CREATE_CATEGORY_FOR_TRIP';
  isActive: boolean;
}

// Global Dashboard Widgets
export type WidgetType = 'NET_WORTH' | 'MONTHLY_FLOW' | 'ACTIVE_GOALS' | 'ACTIVE_DEBTS' | 'SHOPPING_LIST' | 'TODAY_MENU' | 'RECENT_TRANSACTIONS' | 'EXPLORER' | 'CATEGORY_CHART' | 'TREND_CHART' | 'COMPARISON_CHART' | 'SPENDING_FORECAST' | 'FAMILY_AGENDA' | 'BUDGET_STATUS' | 'PROJECTION_WIDGET' | 'TIMELINE_EVOLUTION' | 'FINANCIAL_HEALTH' | 'UPCOMING_PAYMENTS' | 'ANNUAL_COMPARISON' | 'MONTHLY_GOALS' | 'RECIPE_FAVORITES' | 'WEEKLY_PLAN' | 'UPCOMING_TRIPS' | 'FAMILY_TASKS' | 'CRITICAL_INVENTORY' | 'ACCOUNTS_SUMMARY';

export type WidgetCategory = 'FINANCE' | 'LIFE' | 'ALL';

export interface DashboardWidget {
  id: string;
  visible: boolean;
  order: number;
}
export type FinanceWidgetType = 'HEALTH_SCORE' | 'KPI_CARDS' | 'BUDGET_GOALS_SUMMARY' | 'CHART_EVOLUTION' | 'CHART_FLOW' | 'TOP_EXPENSES' | 'RECENT_LIST';

// Kitchen Dashboard Widgets
export type KitchenWidgetType = 'STATS_ROW' | 'TODAY_MENU_CARD' | 'SHOPPING_LIST_CARD';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Reminder {
  id: string;
  title: string;
  dateTime: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date?: string; // Standardized date for logic
  start?: string; // Compatibility with third party calendars
  end?: string;
  allDay?: boolean;
  color?: string;
  type?: 'EVENT' | 'TASK' | 'REMINDER' | 'FINANCE' | 'KITCHEN' | 'LIFE' | 'GOAL';
  amount?: number;
  details?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  icon?: any;
  category?: string;
  targetApp?: string;
  targetTab?: string;
}

// --- SUBSCRIPTION & SAAS ---

export type PlanType = 'FREE' | 'PRO' | 'BUSINESS';

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType;
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIAL';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface UserPlan {
  type: PlanType;
  features: string[];
  limits: {
    maxAccounts: number;
    maxTransactions: number;
    aiInsights: boolean;
    multiDevice: boolean;
  };
}

export interface SyncLog {
  message: string;
  timestamp: number;
  type: 'FINANCE' | 'KITCHEN' | 'LIFE' | 'SYSTEM';
}

// --- DASHBOARD CUSTOMIZATION ---

export interface WidgetLayout {
  i: string;              // Widget ID
  x: number;              // Grid position X
  y: number;              // Grid position Y
  w: number;              // Width (1-12)
  h: number;              // Height (1-4)
  minW?: number;          // Minimum width
  minH?: number;          // Minimum height
  maxW?: number;          // Maximum width
  maxH?: number;          // Maximum height
  static?: boolean;       // Cannot be moved/resized
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  widgets: WidgetLayout[];
  createdAt: string;
  updatedAt: string;
}


// --- COLLABORATIVE MODE / HOUSEHOLDS ---

export interface HouseholdPermissions {
  canEditBudgets: boolean;
  canAddTransactions: boolean;
  canManageMembers: boolean;
  canInviteUsers: boolean;
  canEditSettings: boolean;
}

export interface PermissionMatrix {
  roles: {
    ADMIN: HouseholdPermissions;
    MEMBER: HouseholdPermissions;
    VIEWER: HouseholdPermissions;
  };
}

export interface HouseholdMember {
  userId: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  joinedAt: string;
  // Specific overrides or granular permissions
  canViewAccounts: string[]; // List of Account IDs this user can view
  canEditBudgets: boolean;
  canAddTransactions: boolean;
}

export interface Household {
  id: string;
  name: string;
  ownerId: string; // The creator/owner
  currency: 'EUR' | 'USD' | 'GBP';
  members: HouseholdMember[];
  sharedAccounts: string[]; // List of Account IDs shared in this household
  permissions: PermissionMatrix;
  createdAt: string;
  updatedAt: string;
}

// --- RETIREMENT PLANNER ---

export interface RetirementProjection {
  totalSavings: number;
  monthlyIncome: number;
  yearsOfFunding: number;
}

export interface RetirementPlan {
  id: string;
  userId: string;
  name: string; // e.g. "Early Retirement"
  targetAge: number;
  currentAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number; // Percentage
  inflationRate: number; // Percentage
  targetMonthlyIncome: number;
  projection?: RetirementProjection; // Calculated, not always stored? Or cached.
  linkedGoalId?: string; // Integration with Goals
  createdAt: string;
  updatedAt: string;
}

// --- PREDICTIVE ANALYTICS ---

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

// --- VOICE ASSISTANT ---

export type VoiceActionType =
  | 'ADD_TRANSACTION'
  | 'NAVIGATE'
  | 'QUERY_DATA'
  | 'CREATE_GOAL'
  | 'UNKNOWN';

export interface VoiceAction {
  type: VoiceActionType;
  confidence: number;
  payload: any; // Flexible payload depending on type
  rawText: string;
}

export interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  lastTranscript: string | null;
  lastAction: VoiceAction | null;
  error: string | null;
}
