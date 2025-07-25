import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { finalize, switchMap, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    show() {
        this.loadingSubject.next(true);
    }

    hide() {
        this.loadingSubject.next(false);
    }

    showLoaderUntilCompleted<T>(observable: Observable<T>): Observable<T> {
        return of(null).pipe(
            tap(() => this.show()),
            switchMap(() => observable),
            finalize(() => this.hide())
        )
    }
}