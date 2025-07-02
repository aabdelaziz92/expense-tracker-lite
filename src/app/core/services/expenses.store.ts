import { BehaviorSubject, catchError, combineLatestWith, map, Observable, of, tap, throwError } from "rxjs";
import { Expense, filterByDate, sortExpensesByAmount } from "../models/expense";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoadingService } from "./loading.service";
import { MessagesService } from "./messages.service";
import { Category } from "../models/category";
import { environment } from "../../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class ExpensesStore {
    private expensesSubject: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);
    expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();
    private categoriesSubject: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
    categories$: Observable<Category[]> = this.categoriesSubject.asObservable();
    private exchangeRatesSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    exchangeRates$: Observable<number> = this.exchangeRatesSubject.asObservable();
    private currencySubject = new BehaviorSubject<string>('egp');
    currency$ = this.currencySubject.asObservable();
    private rateSubject = new BehaviorSubject<number>(1);
    rate$ = this.rateSubject.asObservable();


    loadingService: LoadingService = inject(LoadingService);
    messagesService: MessagesService = inject(MessagesService);
    filter: string = 'all';
    pageNumber: number = 0;
    pageSize: number = 10;
    API_KEY: string = environment.apiKey;

    constructor(private http: HttpClient) {
        this.loadExpenses();
        this.getExchangeRate();
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
        this.filter = filter;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;

        return this.expenses$.pipe(
            map(expenses => {
                const total = filterByDate(expenses, filter).length;
                const start = pageNumber * pageSize;
                const end = start + pageSize;
                return filterByDate(expenses, filter).slice(start, end);
            })
        );
    }

    incomeExpenses(filter: string): Observable<Expense[]> {
        return this.getFilteredExpenses(filter, this.pageNumber, this.pageSize).pipe(
            map(expenses => expenses.filter(exp => exp.category === 'salary' || exp.category === 'gift')),
            map(incomes => filterByDate(incomes, filter))
        );
    }

    outcomeExpenses(filter: string): Observable<Expense[]> {
        return this.getFilteredExpenses(filter, this.pageNumber, this.pageSize).pipe(
            map(expenses => expenses.filter(exp => exp.category !== 'salary' && exp.category !== 'gift')),
            map(outcomes => filterByDate(outcomes, filter))
        );
    }

    // getAllExpenses(): Observable<Expense[]> {
    //     return this.expenses$;
    // }

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

    private getExchangeRate() {
        const cacheKey = 'exchangeRatesCache';
        const cacheRaw = localStorage.getItem(cacheKey);

        if (cacheRaw) {
            const cache = JSON.parse(cacheRaw);
            const now = new Date();
            const cachedDate = new Date(cache.timestamp);
            const isSameDay =
                now.getFullYear() === cachedDate.getFullYear() &&
                now.getMonth() === cachedDate.getMonth() &&
                now.getDate() === cachedDate.getDate();

            if (isSameDay && cache.data) {
                // Use cached data
                this.exchangeRatesSubject.next(cache.data);
                return;
            }
        }

        /// Not cached or outdated — fetch from API
        const url = `https://v6.exchangerate-api.com/v6/${this.API_KEY}/latest/USD`;
        const loadRates$ = this.http.get<any>(url).pipe(
            map(response => response.conversion_rates),
            catchError(err => {
                const message = "Could not load exchange rates. Please try again later.";
                this.messagesService.showErrors({ text: message });
                console.error(message, err);
                return throwError(err);
            }),
            tap(exchangeRates => {
                // Save to localStorage with timestamp
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({
                        data: exchangeRates,
                        timestamp: new Date().toISOString()
                    })
                );

                this.exchangeRatesSubject.next(exchangeRates);
            })
        );
        this.loadingService.showLoaderUntilCompleted(loadRates$).subscribe();
    }

    getExchangeRate$(): Observable<any> {
        return this.exchangeRates$;
    }

    setCurrency(currency: string) {
        this.currencySubject.next(currency);
        this.getExchangeRate$().subscribe(rates => {
            const upper = currency.toUpperCase();
            const rate = upper === 'EGP' ? 1 : rates['EGP'] || 1;
            this.rateSubject.next(rate);
        });
    }
}