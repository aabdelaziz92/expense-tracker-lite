import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-list-of-expenses',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './list-of-expenses.html',
  styleUrl: './list-of-expenses.css'
})
export class ListOfExpenses {

  constructor(private router: Router) { }


  addExpense() {

    this.router.navigate(['/expense']);
  }
}
