export interface Expense {
    id: string;
    category: string;
    amount: number;
    date: Date;
    attachment: string;
    icon: string;
    color: string;
    currency: string;
}

export interface ExpensesPage {
    payload: Expense[];
    total: number;
}

// Utils functions

export function sortExpensesByAmount(exp1: Expense, exp2: Expense) {
    return exp1.amount - exp2.amount;
}

export function filterByDate(expenses: Expense[], filter: string): Expense[] {
    switch (filter) {
        case 'today':
            return expenses.filter(exp => checkIfToday(exp.date));
        case 'this_week':
            return expenses.filter(exp => isDateInCurrentWeek(exp.date));
        case 'this_month':
            return expenses.filter(exp => isDateInCurrentMonth(exp.date));
        case 'all':
        default:
            return expenses;
    }
}

export function checkIfToday(date: Date): boolean {
    const today = new Date();
    const targetDate = new Date(date);
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    return targetDate.toDateString() === today.toDateString();
}

export function isDateInCurrentWeek(date: Date): boolean {
    const today = new Date();
    const targetDate = new Date(date);
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Calculate the start of the current week (assuming Monday as the start of the week)
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Sunday
    const startOfWeek = new Date(today.getTime());
    startOfWeek.setDate(today.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate the end of the current week
    const endOfWeek = new Date(startOfWeek.getTime());
    endOfWeek.setDate(startOfWeek.getDate() + 6); // 6 days after Monday
    endOfWeek.setHours(23, 59, 59, 999); // Set to end of day

    // Check if the target date is within the current week
    return targetDate.getTime() >= startOfWeek.getTime() && targetDate.getTime() <= endOfWeek.getTime();
}

export function isDateInCurrentMonth(date: Date): boolean {
    const today = new Date();
    const targetDate = new Date(date);
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    return targetDate.getMonth() === today.getMonth() && targetDate.getFullYear() === today.getFullYear();
}