import { Component, inject, OnInit } from '@angular/core';
import { ListOfExpenses } from "../expense/list-of-expenses/list-of-expenses";
import { LucideAngularModule } from 'lucide-angular';
import { AuthStore } from '../../core/services/auth.store';
import { CommonModule } from '@angular/common';
import { ExpensesStore } from '../../core/services/expenses.store';
import { Expense } from '../../core/models/expense';
import { map, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import { FormControl } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ListOfExpenses,
    LucideAngularModule,
    InfiniteScrollDirective
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  user$ = inject(AuthStore).user$;
  income$!: Observable<Expense[]>;
  expenses$!: Observable<Expense[]>;
  filter: FormControl = new FormControl('all');
  filteredExpenses$: Observable<Expense[]> = of([]);
  nextPage: number = 0;
  currentFilter: string = 'all';
  pageSize: number = 10;

  constructor(private expensesStore: ExpensesStore) {

  }

  ngOnInit(): void {
    this.income$ = this.expensesStore.incomeExpenses();
    this.expenses$ = this.expensesStore.outcomeExpenses();
    this.filteredExpenses$ = this.getListOfExpenses('all');
  }

  getTimeOfDay(): string {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      return 'Morning';
    } else if (hours >= 12 && hours < 18) {
      return 'Afternoon';
    } else {
      return 'Evening';
    }
  }

  getIncomeAmount(): Observable<number> {
    return this.income$.pipe(
      map(expenses => expenses.reduce((total, exp) => +total + +exp.amount, 0))
    );
  }

  getExpenseAmount(): Observable<number> {
    return this.expenses$.pipe(
      map(expenses => expenses.reduce((total, exp) => +total + +exp.amount, 0))
    );
  }

  getTotalBalance(): Observable<number> {
    return this.getIncomeAmount().pipe(
      switchMap(income => this.getExpenseAmount().pipe(
        map(expenses => +income - +expenses)
      ))
    );
  }

  filterExpenses($event: Event) {
    const filter = ($event.target as HTMLSelectElement).value as string;
    this.currentFilter = filter;      // track current filter for pagination
    this.nextPage = 0;                // reset to first page
    this.filteredExpenses$ = this.getListOfExpenses(filter, this.nextPage, this.pageSize);

    // update income and expenses
    this.income$ = this.expensesStore.incomeExpenses();
    this.expenses$ = this.expensesStore.outcomeExpenses();
  }

  getListOfExpenses(filter: string, pageNumber = 0, pageSize = this.pageSize): Observable<Expense[]> {
    return this.expensesStore.getFilteredExpenses(filter, pageNumber, pageSize);
  }

  loadMore() {
    this.nextPage++;
    const nextPageExpenses$ = this.expensesStore.getFilteredExpenses(this.currentFilter, this.nextPage, this.pageSize);

    this.filteredExpenses$ = nextPageExpenses$.pipe(
      withLatestFrom(this.filteredExpenses$),
      map(([newExpenses, oldExpenses]) => [...oldExpenses, ...newExpenses])
    );
  }
}
