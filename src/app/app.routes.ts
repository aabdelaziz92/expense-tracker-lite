import { Routes } from "@angular/router";
import { AuthGuard } from "./core/auth/auth-guard";

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./core/auth/pages/login/login').then(m => m.Login)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [AuthGuard]
    },
    {
        path: 'expense',
        loadComponent: () => import('./features/expense/add-expense/add-expense').then(m => m.AddExpense),
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '/' }
];
