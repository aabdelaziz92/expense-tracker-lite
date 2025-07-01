import { Component } from '@angular/core';
import { ListOfExpenses } from "../expense/list-of-expenses/list-of-expenses";
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [ListOfExpenses, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
