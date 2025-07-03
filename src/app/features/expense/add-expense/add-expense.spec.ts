import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddExpense } from './add-expense';
import { ExpensesStore } from '../../../core/services/expenses.store';
import { Category } from '../../../core/models/category';
import { of } from 'rxjs';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Dashboard } from '../../dashboard/dashboard';
import { By } from '@angular/platform-browser';


fdescribe('AddExpense', () => {
  let component: AddExpense;
  let fixture: ComponentFixture<AddExpense>;
  let expensesStoreSpy: jasmine.SpyObj<ExpensesStore>;

  const mockCategories: Category[] = [
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

  beforeEach(async () => {
    const mockExpensesStore = jasmine.createSpyObj('ExpensesStore', ['getAllCategories', 'addExpense']);
    mockExpensesStore.getAllCategories.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [AddExpense],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'dashboard', component: Dashboard }
        ]),
        // { provide: Router, useValue: mockRouter }, // This is not working and keeps throwing an error ==> The thing is when you import (provideRouter/RouterTestingModule) you should remove all router mocked providers
        { provide: ExpensesStore, useValue: mockExpensesStore }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddExpense);
    component = fixture.componentInstance;
    expensesStoreSpy = TestBed.inject(ExpensesStore) as jasmine.SpyObj<ExpensesStore>;
    fixture.whenStable();
  });

  it('should create the add expense component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with default values', () => {
    expect(component.addForm).toBeDefined();
    expect(component.addForm.valid).toBeFalse();
    expect(component.addForm.get('currency')?.value).toBe('egp');
  });

  it('should mark form as invalid if required fields are missing', () => {
    component.addForm.patchValue({
      amount: '',
      category: '',
      date: ''
    });

    expect(component.addForm.invalid).toBeTrue();
    expect(component.addForm.get('amount')?.hasError('required')).toBeTrue();
    expect(component.addForm.get('category')?.hasError('required')).toBeTrue();
  });

  it('should validate amount as numeric and greater than 0', () => {
    component.addForm.get('amount')?.setValue('abc');
    expect(component.addForm.get('amount')?.valid).toBeFalse();
    expect(component.addForm.get('amount')?.hasError('pattern')).toBeTrue();

    component.addForm.get('amount')?.setValue(0);
    expect(component.addForm.get('amount')?.hasError('min')).toBeTrue();

    component.addForm.get('amount')?.setValue(10);
    expect(component.addForm.get('amount')?.valid).toBeTrue();
  });

  it('should not call addExpense if form is invalid', async () => {
    component.addForm.patchValue({
      category: '',
      amount: '',
      date: ''
    });

    component.addExpense();

    expect(expensesStoreSpy.addExpense).not.toHaveBeenCalled();
  });
});
