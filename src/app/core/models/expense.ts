export interface Expense {
    id: string;
    category: string;
    amount: number;
    date: Date;
    attachment: string;
    icon: string;
    color: string;
}

export interface ExpensesPage {
    payload: Expense[];
    total: number;
}

export function sortExpensesByAmount(exp1: Expense, exp2: Expense) {
    return exp1.amount - exp2.amount;
}
