import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ExpensesStore } from '../../../core/services/expenses.store';
import { CategoriesList } from "./categories-list/categories-list";
import { Category } from '../../../core/models/category';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import * as uuid from 'uuid';
import { Expense } from '../../../core/models/expense';

@Component({
  selector: 'app-add-expense',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterLink,
    CategoriesList
  ],
  // providers: [provideNativeDateAdapter()],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css'
})
export class AddExpense {
  addForm: FormGroup;
  expensesStore = inject(ExpensesStore);
  categories$: Observable<Category[]> = this.expensesStore.getAllCategories()
  selectedCategory: Category | null = null;
  today: string;

  constructor(private fb: FormBuilder, private router: Router) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = currentDate.getDate().toString().padStart(2, '0');
    this.today = `${year}-${month}-${day}`

    this.addForm = this.fb.group({
      id: [uuid.v4()],
      category: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]], // Only allow numbers and must be greater than 0
      date: ['', Validators.required],
      attachment: [''],
      icon: [''],
      color: [''],
      currency: ['egp', Validators.required]
    });
  }

  addExpense() {
    if (this.addForm.valid) {
      if (this.selectedCategory) {
        this.addForm.patchValue({
          icon: this.selectedCategory?.icon,
          color: this.selectedCategory?.color
        })
      }
      const expense = this.addForm.value as Expense;
      this.expensesStore.addExpense(expense);
      this.router.navigate(['/dashboard']);
    }
  }

  onCategorySelected(e: Event) {
    this.categories$.pipe(
      map(categories => categories.forEach(cat => cat.selected = false))
    )
    this.categories$
      .pipe(
        map(categories => categories.find(cat => cat.value === (e.target as HTMLSelectElement).value))
      )
      .subscribe(cat => {
        this.selectedCategory = cat ?? null;
        if (this.selectedCategory) {
          this.selectedCategory.selected = true;
        }
      });
  }

}
