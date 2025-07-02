import { Component, inject, OnInit } from '@angular/core';
import { ListOfExpenses } from "../expense/list-of-expenses/list-of-expenses";
import { LucideAngularModule } from 'lucide-angular';
import { AuthStore } from '../../core/services/auth.store';
import { CommonModule } from '@angular/common';
import { ExpensesStore } from '../../core/services/expenses.store';
import { Expense } from '../../core/models/expense';
import { combineLatest, map, Observable, of, withLatestFrom } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ListOfExpenses,
    LucideAngularModule,
    InfiniteScrollDirective,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private authStore = inject(AuthStore);
  private expensesStore = inject(ExpensesStore);
  user$ = this.authStore.user$;
  dashboardForm: FormGroup = new FormGroup({
    filter: new FormControl('all'),
    currency: new FormControl('egp')
  });
  filteredExpenses$: Observable<Expense[]> = of([]);
  currentFilter: string = 'all';
  nextPage: number = 0;
  pageSize: number = 10;
  income$: Observable<Expense[]> = this.expensesStore.incomeExpenses(this.currentFilter);
  expenses$: Observable<Expense[]> = this.expensesStore.outcomeExpenses(this.currentFilter)


  ngOnInit(): void {
    const filterControl = this.dashboardForm.get('filter');
    const currencyControl = this.dashboardForm.get('currency');

    this.filteredExpenses$ = this.getListOfExpenses(this.currentFilter);
    this.expensesStore.setCurrency('egp');

    filterControl?.valueChanges.subscribe(value => {
      this.currentFilter = value || 'all';
      this.nextPage = 0;
      this.filteredExpenses$ = this.getListOfExpenses(this.currentFilter);
      this.income$ = this.expensesStore.incomeExpenses(this.currentFilter);
      this.expenses$ = this.expensesStore.outcomeExpenses(this.currentFilter);
    });

    currencyControl?.valueChanges.subscribe(value => {
      this.expensesStore.setCurrency(value || 'egp');
      this.filteredExpenses$ = this.getListOfExpenses(this.currentFilter);
    });
  }


  getTimeOfDay(): string {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'Morning';
    if (hours >= 12 && hours < 18) return 'Afternoon';
    return 'Evening';
  }

  getIncomeAmount(): Observable<number> {
    return combineLatest([
      this.income$,
      this.expensesStore.rate$
    ]).pipe(
      map(([expenses, rate]) =>
        expenses.reduce((sum, exp) => sum + +exp.amount, 0) * rate
      )
    );
  }

  getExpenseAmount(): Observable<number> {
    return combineLatest([
      this.expenses$,
      this.expensesStore.rate$
    ]).pipe(
      map(([expenses, rate]) =>
        expenses.reduce((sum, exp) => sum + +exp.amount, 0) * rate
      )
    );
  }

  getTotalBalance(): Observable<number> {
    return combineLatest([
      this.getIncomeAmount(),
      this.getExpenseAmount()
    ]).pipe(
      map(([income, expense]) => income - expense)
    );
  }

  getListOfExpenses(filter: string, pageNumber = 0): Observable<Expense[]> {
    return this.expensesStore.getFilteredExpenses(filter, pageNumber, this.pageSize).pipe(
      withLatestFrom(this.expensesStore.rate$),
      map(([expenses, rate]) =>
        expenses.map(exp => ({
          ...exp,
          amount: +exp.amount * rate
        }))
      )
    );
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
