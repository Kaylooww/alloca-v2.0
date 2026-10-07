export type Profile = {
    id: string;
    name: string;
    email: string;
    allowance: number;
    frequency?: 'daily' | 'weekly' | 'monthly';
    created: string;
};
export type Cycle = {
    id: string;
    user_id: string;
    start: string;
    end: string;
    carry: number;
    frequency?: 'daily' | 'weekly' | 'monthly';
};
export type Transaction = {
    id: string;
    cycle_id: string;
    kind: 'expense' | 'income' | 'allowance' | 'saving' | 'withdrawal';
    amount: number;
    category: string;
    note: string;
    date: string;
    goal_id: string | null;
};
export type Category = {
    id: string;
    name: string;
    color: string;
    archived: number;
};
export type Goal = {
    id: string;
    name: string;
    target: number;
    due: string | null;
    saved: number;
};
export type BudgetData = {
    profile: Profile;
    cycle: Cycle;
    cycles: Cycle[];
    transactions: Transaction[];
    categories: Category[];
    goals: Goal[];
};
