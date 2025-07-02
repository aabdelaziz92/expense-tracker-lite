import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { Message } from "../models/message";

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    private errorsSubject = new BehaviorSubject<Message[]>([]);
    errors$: Observable<Message[]> = this.errorsSubject.asObservable().pipe(
        filter(messages => messages && messages.length > 0)
    );

    showErrors(...errors: Message[]) {
        this.errorsSubject.next(errors);
    }
}