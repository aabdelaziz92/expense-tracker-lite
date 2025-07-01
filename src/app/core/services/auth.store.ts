import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { delay, map, shareReplay } from "rxjs/operators";
import { User } from "../models/user";

const AUTH_DATA = "auth_data";

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    user$: Observable<User | null> = this.userSubject.asObservable();
    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;

    constructor() {
        this.isLoggedIn$ = this.user$.pipe(
            map(user => !!user)
        );
        this.isLoggedOut$ = this.isLoggedIn$.pipe(
            map(isLoggedIn => !isLoggedIn)
        );
        const user = localStorage.getItem(AUTH_DATA);
        if (user) {
            this.userSubject.next(JSON.parse(user));
        }
    }

    login(email: string, password: string): Observable<User> {
        // Mock user object for demonstration; replace with real API call in production
        const mockUser: User = {
            id: 'mock-id',
            email,
            pictureUrl: 'https://example.com/default-picture.png'
        };
        return of<User>(mockUser).pipe(
            map((user: User) => {
                this.userSubject.next(user);
                localStorage.setItem(AUTH_DATA, JSON.stringify(user));
                return user;
            })
        );
    }

    logout(): void {
        this.userSubject.next(null);
        localStorage.removeItem(AUTH_DATA);
    }
}