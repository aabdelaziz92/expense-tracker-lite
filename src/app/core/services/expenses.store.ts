import { BehaviorSubject, catchError, combineLatestWith, map, Observable, of, tap, throwError } from "rxjs";
import { Expense, sortExpensesByAmount } from "../models/expense";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoadingService } from "./loading.service";
import { MessagesService } from "./messages.service";
import { Category } from "../models/category";

@Injectable({
    providedIn: 'root'
})
export class ExpensesStore {
    private expensesSubject: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);
    expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();
    loadingService: LoadingService = inject(LoadingService);
    messagesService: MessagesService = inject(MessagesService);
    private categoriesSubject: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
    categories$: Observable<Category[]> = this.categoriesSubject.asObservable();
    // http: HttpClient = inject(HttpClient);


    constructor() {
        this.loadExpenses();
    }

    private loadExpenses() {
        const storedExpenses = localStorage.getItem('expenses');
        if (storedExpenses) {
            this.expensesSubject.next(JSON.parse(storedExpenses) as Expense[]);
        }
    }

    filterByCategory(category: string): Observable<Expense[]> {
        return this.expenses$.pipe(
            map(expenses => expenses.filter(exp => exp.category === category))
        );
    }

    getFilteredExpenses(filter: string, pageNumber: number = 0, pageSize: number = 10): Observable<Expense[]> {
        return this.expenses$.pipe(
            map(expenses => {
                let filteredExpenses: Expense[];

                switch (filter) {
                    case 'today':
                        filteredExpenses = expenses.filter(exp => this.checkIfToday(exp.date));
                        break;
                    case 'this_week':
                        filteredExpenses = expenses.filter(exp => this.isDateInCurrentWeek(exp.date));
                        break;
                    case 'this_month':
                        filteredExpenses = expenses.filter(exp => this.isDateInCurrentMonth(exp.date));
                        break;
                    case 'all':
                        filteredExpenses = expenses;
                        break;
                    default:
                        return [];
                }

                const total = filteredExpenses.length;
                const start = pageNumber * pageSize;
                const end = start + pageSize;
                return filteredExpenses.slice(start, end);
            })
        );
    }

    incomeExpenses(): Observable<Expense[]> {
        return this.expenses$.pipe(
            map(expenses => expenses.filter(exp => exp.category === 'salary' || exp.category === 'gift'))
        );
    }

    outcomeExpenses(): Observable<Expense[]> {
        return this.expenses$.pipe(
            map(expenses => expenses.filter(exp => exp.category !== 'salary' && exp.category !== 'gift'))
        );
    }

    getAllExpenses(): Observable<Expense[]> {
        return this.expenses$;
    }

    getAllCategories(): Observable<Category[]> {
        const mockCategories = [
            { id: '1', value: 'food', label: 'Food', icon: 'pizza', color: '#DCDAE8', selected: false },
            { id: '2', value: 'gift', label: 'Gift', icon: 'gift', color: '#DCDAE8', selected: false },
            { id: '3', value: 'transport', label: 'Transport', icon: 'car', color: '#D9C2EA', selected: false },
            { id: '4', value: 'rent', label: 'Rent', icon: 'house', color: '#CFB183', selected: false },
            { id: '5', value: 'shopping', label: 'Shopping', icon: 'ShoppingCart', color: '#EABF74', selected: false },
            { id: '6', value: 'entertainment', label: 'Entertainment', icon: 'FerrisWheel', color: '#1C57F0', selected: false },
            { id: '7', value: 'fuel', label: 'Fuel', icon: 'fuel', color: '#E39E9E', selected: false },
            { id: '8', value: 'salary', label: 'Salary', icon: 'BanknoteArrowUp', color: '#E39E9E', selected: false },
            { id: '9', value: 'other', label: 'Other', icon: 'shapes', color: '#808080', selected: false }
        ];
        this.categoriesSubject.next(mockCategories);
        return this.categories$;
    }

    addExpense(expense: Expense): void {
        this.expensesSubject.next([...this.expensesSubject.value, expense]);
        this.saveExpenses();
    }

    private saveExpenses(): void {
        localStorage.setItem('expenses', JSON.stringify(this.expensesSubject.value));
    }

    checkIfToday(date: Date): boolean {
        const today = new Date();
        const targetDate = new Date(date);
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        return targetDate.toDateString() === today.toDateString();
    }

    isDateInCurrentWeek(date: Date): boolean {
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

    isDateInCurrentMonth(date: Date): boolean {
        const today = new Date();
        const targetDate = new Date(date);
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        return targetDate.getMonth() === today.getMonth() && targetDate.getFullYear() === today.getFullYear();
    }
}