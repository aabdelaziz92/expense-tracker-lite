import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-add-expense',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
    RouterLink
  ],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css'
})
export class AddExpense {
  addForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.addForm = this.fb.group({
      categories: ['', [Validators.required]],
      amount: ['', Validators.required],
      date: ['', Validators.required],
      attachment: [''],
    });
  }

  addExpense() {
    if (this.addForm.valid) {
      const expense = this.addForm.value;
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      expenses.push(expense);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      this.router.navigate(['/expense/list']);
    }
  }

}
