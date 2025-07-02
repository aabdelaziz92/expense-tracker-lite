import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ExpensesStore } from '../../../core/services/expenses.store';
import { Expense } from '../../../core/models/expense';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-of-expenses',
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './list-of-expenses.html',
  styleUrl: './list-of-expenses.css'
})
export class ListOfExpenses {
  expensesStore = inject(ExpensesStore);
  @Input() expenses$!: Observable<Expense[]>;
  startIndex = 0;

  constructor(private router: Router) {
    this.expenses$?.subscribe(expenses => {
      this.startIndex = expenses.length;
    });
  }


  addExpense() {
    this.router.navigate(['/expense']);
  }

  checkIfToday(date: Date): boolean {
    const today = new Date();
    const targetDate = new Date(date);
    // Reset hours, minutes, seconds, and milliseconds to compare only the date part
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    return targetDate.getTime() === today.getTime();
  }
}
