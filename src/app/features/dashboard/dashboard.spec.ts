import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ListOfExpenses } from '../expense/list-of-expenses/list-of-expenses';
import { LucideAngularModule } from 'lucide-angular';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthStore } from '../../core/services/auth.store';
import { ExpensesStore } from '../../core/services/expenses.store';
import { BehaviorSubject, of } from 'rxjs';
import { Expense } from '../../core/models/expense';

fdescribe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let authStoreSpy: jasmine.SpyObj<AuthStore>;
  let expensesStoreSpy: jasmine.SpyObj<ExpensesStore>;

  const mockExpenses: Expense[] = [
    { id: '1', amount: 100, date: new Date('2024-01-01'), category: 'food', currency: 'egp', attachment: '', icon: '', color: '' },
    { id: '2', amount: 200, date: new Date('2024-01-02'), category: 'transport', currency: 'egp', attachment: '', icon: '', color: '' },
  ];

  const mockIncome: Expense[] = [
    { id: '1', amount: 1000, date: new Date('2024-01-01'), category: 'salary', currency: 'egp', attachment: '', icon: '', color: '' },
  ];

  beforeEach(async () => {
    const authStoreMock = jasmine.createSpyObj('AuthStore', ['user$']);
    // authStoreMock.user$.and.returnValue(of({
    //   name: 'Ahmed Abdelaziz',
    //   pictureUrl: 'https://example.com/avatar.jpg'
    // }));

    const expensesStoreMock = jasmine.createSpyObj('ExpensesStore', [
      'incomeExpenses',
      'outcomeExpenses',
      'getFilteredExpenses',
      'setCurrency'
    ]);
    // expensesStoreMock.expenses$.and.returnValue(of(mockExpenses));
    const income$ = new BehaviorSubject(mockIncome);
    const outcome$ = new BehaviorSubject(mockExpenses);
    const rate$ = new BehaviorSubject(30);
    expensesStoreMock.incomeExpenses.and.returnValue(income$);
    expensesStoreMock.outcomeExpenses.and.returnValue(outcome$);
    expensesStoreMock.getFilteredExpenses.and.returnValue(of(mockExpenses));
    expensesStoreMock.rate$ = rate$;

    await TestBed.configureTestingModule({
      imports: [
        Dashboard
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClient(),
        { provide: AuthStore, useValue: authStoreMock },
        { provide: ExpensesStore, useValue: expensesStoreMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    authStoreSpy = TestBed.inject(AuthStore) as jasmine.SpyObj<AuthStore>;
    expensesStoreSpy = TestBed.inject(ExpensesStore) as jasmine.SpyObj<ExpensesStore>;
    fixture.whenStable();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should update currency using setCurrency when currency changes', async () => {
    component.dashboardForm.get('currency')?.setValue('usd');
    component.dashboardForm.get('currency')?.valueChanges.subscribe(value => {
      expect(value).toBe('usd');
      expect(expensesStoreSpy.setCurrency).toHaveBeenCalledWith('usd');
    })
  });

  it('should calculate total income amount using exchange rate', async () => {
    component.getIncomeAmount().subscribe(total => {
      // 1000 * 30 = 30000
      expect(total).toBe(30000);
    });
  });

  it('should calculate total expense amount using exchange rate', async () => {
    component.getExpenseAmount().subscribe(total => {
      // (100 + 200) * 30 = 300 * 30
      expect(total).toBe(9000);
    });
  });

  it('should calculate total balance correctly', async () => {
    component.getTotalBalance().subscribe(balance => {
      // income: 1000 * 30 = 30000
      // expense: (100+200) * 30 = 9000
      expect(balance).toBe(21000);
    });
  });

  it('should apply exchange rate to filtered expenses in getListOfExpenses()', async () => {
    component.getListOfExpenses('all').subscribe(expenses => {
      expect(expenses.length).toBe(2);
      expect(expenses[0].amount).toBe(100 * 30);
      expect(expenses[1].amount).toBe(200 * 30);
    });
  });


});
